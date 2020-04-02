import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { SimSerial, AlertService, PageLoadingService, ShoppingCart } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import {
  WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN_TELEWIZ,
  WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN_JAYMART
} from 'src/app/device-order/constants/wizard.constant';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { TranslateService } from '@ngx-translate/core';
import {
  ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_SELECT_NUMBER_PAGE,
  ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_SELECT_PACKAGE_PAGE
} from '../../constants/route-path.constant';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { VerifyInstantSimService } from '../../services/verify-instant-sim.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';

declare let window: any;
declare let $: any;

@Component({
  selector: 'app-new-register-mnp-verify-instant-sim-page',
  templateUrl: './new-register-mnp-verify-instant-sim-page.component.html',
  styleUrls: ['./new-register-mnp-verify-instant-sim-page.component.scss']
})
export class NewRegisterMnpVerifyInstantSimPageComponent implements OnInit, OnDestroy {
  wizards: string[];
 wizardJaymart: string[] = WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN_JAYMART;
 wizardTelewiz: string[] = WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN_TELEWIZ;
  simSerialForm: FormGroup;
  transaction: Transaction;
  simSerial: SimSerial;
  simSerialValid: boolean;
  shoppingCart: ShoppingCart;

  aisNative: any = window.aisNative;
  getBarcode: any;
  mobileNoScan: string;
  simSerialScan: string;
  xmlDoc: any;
  offerType: string;
  isNativeApp: boolean;
  simSerialFormSubmitted: boolean;
  isSimSerial: boolean;

  mockSimSerial: any = '<barcode>1720202094595</barcode>';
  priceOption: PriceOption;
  constructor(
    private router: Router,
    private transactionService: TransactionService,
    private pageLoadingService: PageLoadingService,
    private alertService: AlertService,
    private shoppingCartService: ShoppingCartService,
    private fb: FormBuilder,
    private zone: NgZone,
    private verifyInstantSimService: VerifyInstantSimService,
    private translationService: TranslateService,
    private priceOptionService: PriceOptionService
  ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.checkJaymart();
    this.createForm();
    delete this.transaction.data.simCard;
    this.shoppingCart = Object.assign(this.shoppingCartService.getShoppingCartDataSuperKhum(), {
      mobileNo: ''
    });

    this.aisNative = this.aisNative || {
      sendIccCommand: (): void => {/**/
      },
      scanBarcode: (): void => {
        window.onBarcodeCallback(this.mockSimSerial);
      }
    };

    this.isNativeApp = false;
    if (typeof window.aisNative !== 'undefined') {
      this.isNativeApp = true;
    }

    if (typeof this.aisNative !== 'undefined') {

      window.onBarcodeCallback = (barcode: any): void => {
        if (barcode && barcode.length > 0) {
          this.zone.run(() => {
            const parser: any = new DOMParser();
            barcode = '<data>' + barcode + '</data>';
            this.xmlDoc = parser.parseFromString(barcode, 'text/xml');
            this.getBarcode = this.xmlDoc.getElementsByTagName('barcode')[0].firstChild.nodeValue;
            this.getMobileNoByBarcode(this.getBarcode, true);
          });
        }
      };
    }
    this.initialData();
    // console.log('isNativeApp= ' + this.isNativeApp);
  }

  checkJaymart(): void {
    const outChnSale = this.priceOption.queryParams.isRole;
    if (outChnSale && (outChnSale === 'Retail Chain' || outChnSale === 'RetailChain')) {
      this.wizards = this.wizardJaymart;
    } else {
      this.wizards = this.wizardTelewiz;
    }
  }

  private createForm(): void {
    this.simSerialForm = this.fb.group({
      simSerial: ['', [
        Validators.required,
        Validators.pattern(/\d{13}/)
      ]]
    });
  }

  initialData(): void {
    this.mobileNoScan = '';
    this.simSerialScan = '';
    this.offerType = '';
  }

  openScanBarcode(): void {
    this.aisNative.scanBarcode();
  }

  checkBarcode(barcode: string, isScan: boolean): void {
    if (!this.simSerialForm.valid && !isScan) {
      this.simSerialFormSubmitted = true;
    } else {
      this.getMobileNoByBarcode(barcode, isScan);
    }
  }

  getMobileNoByBarcode(barcode: string, isScan: boolean): void {
    const self: any = this;
    if (isScan) {
      self.mobileNoKeyIn = '';
      self.simSerialKeyIn = '';
    }
    this.pageLoadingService.openLoading();
    this.verifyInstantSimService.verifyInstantSim(barcode)
      .then(resp => {
        const data = resp.data;
        if (data) {
          if (data.prepChargeType === 'Pre-paid') {
            this.clearMobileBySerial(isScan);
            this.pageLoadingService.closeLoading();
            this.alertService.error('หมายเลขนี้ เป็นหมายเลขระบบเติมเงิน<br>กรุณาเลือกหมายเลขใหม่');
          } else if (data.mobileStatus === 'Registered') {
            this.clearData();
            this.pageLoadingService.closeLoading();
            this.alertService.error('หมายเลขนี้ ไม่สามารถทำรายการได้<br>กรุณาเลือกหมายเลขใหม่');
          } else if (data.mobileStatus !== 'Registered' && data.mobileStatus !== 'Reserved') {
            this.clearData();
            this.pageLoadingService.closeLoading();
            this.alertService.error('หมายเลขนี้ ไม่สามารถทำรายการได้<br>กรุณาเลือกหมายเลขใหม่');
          } else {
            this.clearData();
            if (isScan) {
              self.mobileNoScan = data.mobileNo;
              self.simSerialScan = barcode;
              this.isSimSerial = true;
              this.simSerialFormSubmitted = false;
              this.pageLoadingService.closeLoading();
              this.clearMobileBySerial(!isScan);
              this.submitSelectMobile();
            } else {
              self.mobileNoKeyIn = data.mobileNo;
              self.simSerialKeyIn = barcode;
              this.isSimSerial = true;
              this.pageLoadingService.closeLoading();
              this.clearMobileBySerial(!isScan);
              this.submitSelectMobile();
            }
          }
        } else {
          this.pageLoadingService.closeLoading();
          throw new Error('Cannot Verify the instant sim');
        }
      })
      .catch((resp) => {
        let errMessage: string;
        if (resp.error && resp.error.developerMessage) {
          errMessage = 'หมายเลขนี้ ไม่สามารถทำรายการได้ กรุณาเลือกหมายเลขใหม่';
        }
        this.pageLoadingService.closeLoading();
        this.simSerialValid = false;
        this.simSerial = undefined;
        this.clearData();
        this.alertService.error(errMessage);
        // this.alertService.notify({
        //   type: 'error',
        //   html: this.translationService.instant(error.resultDescription.replace(/<br>/, ' '))
        // });
      });
  }

  clearMobileBySerial(isScan: boolean): void {
    if (isScan) {
      this.mobileNoScan = '';
      this.simSerialScan = '';
    }
  }

  clearData(): void {
    this.mobileNoScan = '';
    this.simSerialScan = '';
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_SELECT_NUMBER_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_SELECT_PACKAGE_PAGE]);
  }

  submitSelectMobile(): void {
    const selectedSimSerialNo: string = this.simSerialScan ? this.simSerialScan : this.simSerialForm.controls['simSerial'].value;

    this.verifyInstantSimService.verifyInstantSim(selectedSimSerialNo).then((resp) => {
      const data = resp.data;
      if (data.mobileStatus === 'Registered') {
        this.clearData();
        this.pageLoadingService.closeLoading();
        this.alertService.error('หมายเลข ' + data.mobileNo + ' มีผู้ใช้งานแล้ว กรุณาเลือกหมายเลขใหม่');
      } else if (data.mobileStatus !== 'Registered' && data.mobileStatus !== 'Reserved') {
        this.clearData();
        this.pageLoadingService.closeLoading();
        this.alertService.error('สถานะหมายเลข ' + data.mobileNo + ' ไม่พร้อมทำรายการ กรุณาเลือกหมายเลขใหม่');
      } else {
        this.simSerialValid = true;
        this.simSerial = {
          mobileNo: data.mobileNo,
          simSerial: selectedSimSerialNo
        };
        this.transaction.data.simCard = {
          mobileNo: this.simSerial.mobileNo,
          simSerial: this.simSerial.simSerial,
          persoSim: false,
          imei: this.priceOption.productDetail.imei ? this.priceOption.productDetail.imei : ''
        };
        this.pageLoadingService.closeLoading();
      }
    })
      .catch((err) => {
        this.clearData();
        const error = err.error || [];
        this.pageLoadingService.closeLoading();
        this.alertService.notify({
          type: 'error',
          html: this.translationService.instant(error.resultDescription.replace(/<br>/, ' '))
        });
      });
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}
