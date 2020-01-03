import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter, NgZone } from '@angular/core';
import { SimSerial, HomeService, AlertService, PageLoadingService, ShoppingCart, AisNativeService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN } from 'src/app/device-order/constants/wizard.constant';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, Observable } from 'rxjs';
import {
  ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_SELECT_NUMBER_PAGE,
  ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_SELECT_PACKAGE_PAGE
} from '../../constants/route-path.constant';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { RemoveCartService } from '../../services/remove-cart.service';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';

declare let window: any;
declare let $: any;

@Component({
  selector: 'app-new-register-mnp-verify-instant-sim-page',
  templateUrl: './new-register-mnp-verify-instant-sim-page.component.html',
  styleUrls: ['./new-register-mnp-verify-instant-sim-page.component.scss']
})
export class NewRegisterMnpVerifyInstantSimPageComponent implements OnInit {
  wizards: string[] = WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN;
  simSerialForm: FormGroup;
  transaction: Transaction;
  simSerial: SimSerial;
  simSerialValid: boolean;
  shoppingCart: ShoppingCart;
  translationSubscribe: Subscription;
  keyinSimSerial: boolean;
  scanBarCode: boolean;
  simSerialByBarCode: any;
  // @ViewChild('serial')
  // serialField: ElementRef;

  aisNative: any = window.aisNative;
  scanBarcodeText: string = 'สแกน Barcode';
  getBarcode: any;
  getMobileNoFn: any;
  mobileNoKeyIn: string;
  mobileNoScan: string;
  registrationData: any;
  simSerialScan: string;
  urlBackLink: string;
  xmlDoc: any;
  minLength: number = 13;
  offerType: string;
  isHandsetDiscount: boolean;
  isNativeApp: boolean;
  simSerialFormSubmitted: boolean;
  isSimSerial: boolean;

  mockSimSerial: any = '<barcode>1720202094595</barcode>';

  constructor(
    private router: Router,
    private transactionService: TransactionService,
    private pageLoadingService: PageLoadingService,
    private alertService: AlertService,
    private shoppingCartService: ShoppingCartService,
    private fb: FormBuilder,
    private aisNativeService: AisNativeService,
    private removeCartService: RemoveCartService,
    private zone: NgZone,
    ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
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
    console.log('isNativeApp= ' + this.isNativeApp);
  }

  private createForm(): void {
    this.simSerialForm = this.fb.group({
      simSerial: ['', [
        Validators.required,
        Validators.minLength(this.minLength),
        Validators.pattern(/\d{13}/)
      ]]
    });
  }

  initialData(): void {
    this.mobileNoScan = '';
    this.mobileNoKeyIn = '';
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
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_SELECT_NUMBER_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_SELECT_PACKAGE_PAGE]);
  }

  verifyInstantSim(barCode: any): any {
  }

}
