import { Component, OnInit, ViewChild, OnDestroy, ElementRef, AfterViewInit, EventEmitter, Output, Input, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_NEW_SHARE_PLAN_MNP_SELECT_NUMBER_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_SELECT_PACKAGE_MASTER_PAGE } from '../../constants/route-path.constant';
import { WIZARD_ORDER_NEW_SHARE_PLAN_MNP } from 'src/app/order/constants/wizard.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { SimSerial, SimSerialComponent, HomeService, PageLoadingService, AlertService, TokenService, AisNativeService, Utils } from 'mychannel-shared-libs';
import { Subscription } from 'rxjs';
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
export class NewSharePlanMnpVerifyInstantSimPageComponent implements OnInit, OnDestroy, AfterViewInit {

  wizards: string[] = WIZARD_ORDER_NEW_SHARE_PLAN_MNP;
  transaction: Transaction;
  simSerial: SimSerial;
  // simSerialValid: boolean;
  translationSubscribe: Subscription;
  serialForm: FormGroup;
  keyinSimSerial: boolean;
  isHandsetDiscount: boolean;
  isEasyApp: boolean;
  barcodeSubscription: Subscription;

  // @Input()
  // simSerial: SimCardScan;

  @Output()
  barcode: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('mcSimSerial')
  mcSimSerial: SimSerialComponent;
  serial: any;

  @ViewChild('serial')
  serialField: ElementRef;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private translationService: TranslateService,
    private pageLoadingService: PageLoadingService,
    private http: HttpClient,
    private alertService: AlertService,
    private fb: FormBuilder,
    private aisNativeService: AisNativeService,
    private utils: Utils,
    private _ngZone: NgZone
    // private tokenService: TokenService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    delete this.transaction.data.simCard;
    this.createForm();
    this.findTextChangKiosk();
  }

  private createForm(): void {
    this.serialForm = this.fb.group({
      serial: ['', [Validators.required, Validators.pattern(/\d{13}/)]]
    });
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

  checkSimSerial(): void {
    this.keyinSimSerial = true;
    const serial = this.serialForm.controls['serial'].value;
    this.getMobileNoBySim(serial);
  }

  private getMobileNoBySim(serial: any): void {
    this.pageLoadingService.openLoading();
    this.http.get(`/api/customerportal/validate-verify-instant-sim?serialNo=${serial}`).toPromise()
      .then((resp: any) => {
        alert('then' + resp);
        this.simSerial = {
          mobileNo: resp.data.mobileNo,
          simSerial: serial
        };
        this.transaction.data.simCard = {
          mobileNo: this.simSerial.mobileNo,
          simSerial: this.simSerial.simSerial,
          persoSim: false
        };
        // this.simSerialValid = true;
        this.pageLoadingService.closeLoading();
      }).catch((error: any) => {
        this.pageLoadingService.closeLoading();
        // this.simSerialValid = false;
        this.alertService.notify({
          type: 'error',
          // html: this.translationService.instant()
          html: error.developerMessage.replace(/<br>/, ' ')
        });
        // this.onSubmit();
      });
  }

  private onSubmit(): void {
    this.serialForm.patchValue({
      serial: ''
    });
    this.serialField.nativeElement.focus();
  }

  findTextChangKiosk(): void {
    window.fireTextChanged = (id: any) => {
      if (id) {
        const input: any = document.getElementById(id);
        const value: any = input.value;
        if (value !== '' && value.match(/^[0-9]{13}$/)) {
          this.serial.emit(value);
          this.serialForm.patchValue({
            serial: ''
          });
          this.serialField.nativeElement.focus();
        }
      }
    };
  }

  ngAfterViewInit(): void {
    this.serialField.nativeElement.focus();
  }

  isAisNative(): boolean {
    return this.utils.isAisNative();
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

  ngOnDestroy(): void {
    this.barcodeSubscription.unsubscribe();
    this.transactionService.update(this.transaction);
  }

}
