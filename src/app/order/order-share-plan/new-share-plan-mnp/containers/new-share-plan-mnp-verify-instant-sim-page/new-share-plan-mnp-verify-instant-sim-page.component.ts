import { Component, OnInit, ViewChild, OnDestroy, ElementRef, AfterViewInit, EventEmitter, Output, Input, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_NEW_SHARE_PLAN_MNP_SELECT_NUMBER_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_SELECT_PACKAGE_MASTER_PAGE } from '../../constants/route-path.constant';
import { WIZARD_ORDER_NEW_SHARE_PLAN_MNP } from 'src/app/order/constants/wizard.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { SimSerial, SimSerialComponent, HomeService, PageLoadingService, AlertService, TokenService, AisNativeService, Utils } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

declare let window: any;

@Component({
  selector: 'app-new-share-plan-mnp-verify-instant-sim-page',
  templateUrl: './new-share-plan-mnp-verify-instant-sim-page.component.html',
  styleUrls: ['./new-share-plan-mnp-verify-instant-sim-page.component.scss']
})
export class NewSharePlanMnpVerifyInstantSimPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_ORDER_NEW_SHARE_PLAN_MNP;
  transaction: Transaction;
  simSerial: SimSerial;
  serialForm: FormGroup;
  keyinSimSerial: boolean;
  // simSerialValid: boolean;
  // translationSubscribe: Subscription;
  // isHandsetDiscount: boolean;
  // isEasyApp: boolean;

  @ViewChild('serial') serialField: ElementRef;

  constructor(
    private router: Router,
    private transactionService: TransactionService,
    private translationService: TranslateService,
    private pageLoadingService: PageLoadingService,
    private http: HttpClient,
    private alertService: AlertService,
    private fb: FormBuilder,
    private utils: Utils,
    private _ngZone: NgZone
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    delete this.transaction.data.simCard;
    this.createForm();
  }

  onBack(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_SELECT_NUMBER_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_SELECT_PACKAGE_MASTER_PAGE]);
  }

  onHome(): void {
    window.location.href = '/sales-portal/dashboard';
  }

  createForm(): void {
    this.serialForm = this.fb.group({
      serial: ['', [Validators.required, Validators.pattern(/\d{13}/)]]
    });
  }

  isAisNative(): boolean {
    return this.utils.isAisNative();
  }

  onCheckSimSerial(): void {
    this.keyinSimSerial = true;
    const serial = this.serialForm.controls['serial'].value;
    this.getMobileNoBySim(serial);
  }

  onOpenScanBarcode(): void {
    this.keyinSimSerial = false;
    this.serialForm.controls['serial'].setValue('');
    window.aisNative.scanBarcode();
    let barcodeSerial: string = '';
    window.onBarcodeCallback = (barcode: any): void => {
      if (barcode && barcode.length > 0) {
        this._ngZone.run(() => {
          const parser: any = new DOMParser();
          barcode = '<data>' + barcode + '</data>';
          const xmlDoc = parser.parseFromString(barcode, 'text/xml');
          barcodeSerial = xmlDoc.getElementsByTagName('barcode')[0].firstChild.nodeValue;
          this.getMobileNoBySim(barcodeSerial);
        });
      }
    };
  }

  getMobileNoBySim(serial: any): void {
    this.pageLoadingService.openLoading();
    this.http.get(`/api/customerportal/validate-verify-instant-sim?serialNo=${serial}`).toPromise()
      .then((resp: any) => {
        this.pageLoadingService.closeLoading();
        this.simSerial = {
          mobileNo: resp.data.mobileNo,
          simSerial: serial
        };
        this.transaction.data.simCard = {
          mobileNo: this.simSerial.mobileNo,
          simSerial: this.simSerial.simSerial,
          persoSim: false
        };
      }).catch((err: any) => {
        this.pageLoadingService.closeLoading();
        this.alertService.notify({
          type: 'error',
          html: err.error.developerMessage.replace(/<br>/, ' ')
        });
        this.onSubmit();
      });
  }

  onSubmit(): void {
    this.serialForm.controls['serial'].setValue('');
    // this.serialForm.patchValue({ serial: '' });
    this.serialField.nativeElement.focus();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}
