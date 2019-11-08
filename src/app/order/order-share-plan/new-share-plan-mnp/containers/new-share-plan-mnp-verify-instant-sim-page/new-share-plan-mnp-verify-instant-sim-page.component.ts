import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_NEW_SHARE_PLAN_MNP_SELECT_NUMBER_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_SELECT_PACKAGE_MASTER_PAGE } from '../../constants/route-path.constant';
import { WIZARD_ORDER_NEW_SHARE_PLAN_MNP } from 'src/app/order/constants/wizard.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PageLoadingService, AlertService, Utils } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { StoreService } from '../../service/store.service';

declare let window: any;

@Component({
  selector: 'app-new-share-plan-mnp-verify-instant-sim-page',
  templateUrl: './new-share-plan-mnp-verify-instant-sim-page.component.html',
  styleUrls: ['./new-share-plan-mnp-verify-instant-sim-page.component.scss']
})
export class NewSharePlanMnpVerifyInstantSimPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_ORDER_NEW_SHARE_PLAN_MNP;
  transaction: Transaction;
  serialForm: FormGroup;
  keyInSimSerial: boolean;
  simSerialValid: boolean;

  constructor(
    private router: Router,
    private transactionService: TransactionService,
    private translationService: TranslateService,
    private pageLoadingService: PageLoadingService,
    private http: HttpClient,
    private alertService: AlertService,
    private fb: FormBuilder,
    private utils: Utils,
    private _ngZone: NgZone,
    private storeService: StoreService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.createForm();
    this.checkShowData();
    this.onChangeSerialForm();
  }

  onBack(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_SELECT_NUMBER_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_SELECT_PACKAGE_MASTER_PAGE]);
  }

  createForm(): void {
    this.serialForm = this.fb.group({
      serial: ['', [Validators.required, Validators.pattern(/\d{13}/)]]
    });
  }

  checkShowData(): void {
    this.simSerialValid = this.storeService.simSerialValid === true ? true : false;
    this.keyInSimSerial = this.storeService.keyInSimSerial === true ? true : false;
    this.keyInSimSerial === true ? this.setValueSerialForm(this.transaction) : this.setValueSerialForm();
    this.transaction && this.transaction.data.simCard ? this.setSimSerialValid(true) : this.setSimSerialValid(false);
  }

  onChangeSerialForm(): void {
    this.serialForm.valueChanges.subscribe(() => {
      this.serialForm.valid ? this.setSimSerialValid(true) : delete this.transaction.data.simCard; this.setSimSerialValid(false);
    });
  }

  isAisNative(): boolean {
    return this.utils.isAisNative();
  }

  onCheckSimSerial(): void {
    const serial = this.serialForm.controls['serial'].value;
    this.getMobileNoBySim(serial);
    this.setKeyInSimSerial(true);
  }

  onOpenScanBarcode(): void {
    window.aisNative.scanBarcode();
    let barcodeSerial: string = '';
    window.onBarcodeCallback = (barcode: any): void => {
      if (barcode && barcode.length > 0) {
        this.setKeyInSimSerial(false);
        this.setValueSerialForm();
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
        this.setSimSerialValid(true);
        this.transaction.data.simCard = {
          mobileNo: resp.data.mobileNo,
          simSerial: serial,
          persoSim: false
        };
      }).catch((err: any) => {
        this.pageLoadingService.closeLoading();
        this.setSimSerialValid(false);
        this.setValueSerialForm();
        delete this.transaction.data.simCard;
        this.alertService.notify({
          type: 'error',
          html: err.error.developerMessage.replace(/<br>/, ' ')
        });
      });
  }

  setKeyInSimSerial(keyInSimSerial: boolean): void {
    this.keyInSimSerial = keyInSimSerial;
    this.storeService.keyInSimSerial = this.keyInSimSerial;
  }

  setSimSerialValid(simSerialValid: boolean): void {
    this.simSerialValid = simSerialValid;
    this.storeService.simSerialValid = this.simSerialValid;
  }

  setValueSerialForm(transaction?: Transaction): void {
    const simSerial = transaction && transaction.data.simCard ? transaction.data.simCard.simSerial : '';
    simSerial ? this.serialForm.controls['serial'].setValue(simSerial) : this.serialForm.controls['serial'].setValue('');
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}
