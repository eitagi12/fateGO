import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_DEVICE_ONLY_KIOSK_SELECT_MOBILE_CARE_PAGE, ROUTE_DEVICE_ONLY_KIOSK_SELECT_PAYMENT_AND_RECEIPT_INFORMATION_PAGE } from '../../constants/route-path.constant';
import { Transaction, TransactionAction, TransactionType } from 'src/app/shared/models/transaction.model';
import { WIZARD_DEVICE_ONLY_AIS } from 'src/app/device-only/constants/wizard.constant';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Product } from 'src/app/device-only/models/product.model';
import { PaymentDetail, User, HomeService, ApiRequestService, AlertService, TokenService, PaymentDetailBank } from 'mychannel-shared-libs';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOptionUtils } from 'src/app/shared/utils/price-option-utils';
import { CreateOrderService } from 'src/app/device-only/services/create-order.service';
import { HomeButtonService } from 'src/app/device-only/services/home-button.service';
import { ROUTE_BUY_PRODUCT_CAMPAIGN_PAGE } from 'src/app/buy-product/constants/route-path.constant';
// Test
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface CustomerAddress {
  homeNo: string;
  moo?: string;
  mooBan?: string;
  room?: string;
  floor?: string;
  buildingName?: string;
  soi?: string;
  street?: string;
  province: string;
  amphur: string;
  tumbol: string;
  zipCode: string;
}

@Component({
  selector: 'app-device-only-kiosk-select-payment-and-receipt-information-page',
  templateUrl: './device-only-kiosk-select-payment-and-receipt-information-page.component.html',
  styleUrls: ['./device-only-kiosk-select-payment-and-receipt-information-page.component.scss']
})
export class DeviceOnlyKioskSelectPaymentAndReceiptInformationPageComponent implements OnInit, OnDestroy {
  wizards: string[] = WIZARD_DEVICE_ONLY_AIS;
  transaction: Transaction;
  public priceOption: PriceOption;
  isReceiptInformationValid: boolean;
  public product: Product;
  isSelectBank: any;
  fullPayment: boolean;
  banks: any[];
  paymentDetail: PaymentDetail;
  paymentDetailTemp: any;
  paymentDetailValid: boolean;
  customerInfoTemp: any;
  user: User;
  localtion: any;
  addessValid: boolean;
  omiseBanks: PaymentDetailBank[];

  // Test
  // customerAddress: CustomerAddress;
  // allZipCodes: string[];
  // provinces: any[];
  // amphurs: string[];
  // tumbols: string[];
  // zipCodes: string[];
  translationSubscribe: Subscription;
  customerAddressForm: FormGroup;
  provinces: string[];
  amphurs: string[];
  tumbols: string[];
  zipCodes: string[];
  allProvinces: string[];
  allZipCodes: string[];
  customerAddress: CustomerAddress;

  constructor(
    private router: Router,
    private http: HttpClient,
    private homeService: HomeService,
    private apiRequestService: ApiRequestService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private createOrderService: CreateOrderService,
    private alertService: AlertService,
    private homeButtonService: HomeButtonService,
    private tokenService: TokenService,
    private translation: TranslateService,
    public fb: FormBuilder
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.user = this.tokenService.getUser();
  }

  ngOnInit(): void {
    this.homeButtonService.initEventButtonHome();
    this.apiRequestService.createRequestId();

    let commercialName = this.priceOption.productDetail.name;
    if (this.priceOption.productStock.color) {
      commercialName += ` สี ${this.priceOption.productStock.color}`;
    }
    // REFACTOR IT'S
    this.paymentDetail = {
      commercialName: commercialName,
      promotionPrice: this.priceOption.trade.priceType === 'NORMAL' ? +(this.priceOption.trade.normalPrice)
        : +(this.priceOption.trade.promotionPrice),
      isFullPayment: this.isFullPayment(),
      installmentFlag: false,
      advancePay: 0,
      qrCode: true,
      omisePayment: this.isFullPayment() && this.priceOption.productStock.company !== 'WDS'
    };
    this.http.get('/api/salesportal/omise/get-bank').toPromise()
      .then((res: any) => {
        const data = res.data || [];
        this.omiseBanks = data;
      });

    if (this.priceOption.trade.banks && this.priceOption.trade.banks.length > 0) {
      // if (this.isFullPayment()) {
      //   this.banks = this.priceOption.trade.banks || [];
      // } else {
      this.banks = (this.priceOption.trade.banks || []);
      // .map((b: any) => {
      //     return b.installmentDatas.map((data: any) => {
      //       return {
      //         ...b,
      //         installment: `${data.installmentPercentage}% ${data.installmentMounth}`
      //       };
      //     });
      //   }).reduce((prev: any, curr: any) => {
      //     curr.forEach((element: any) => {
      //       prev.push(element);
      //     });
      //     return prev;
      // }, []);
      // }
    } else {
      this.localtion = this.tokenService.getUser();
      this.localtion = this.user.locationCode;
      this.http.post('/api/salesportal/banks-promotion', {
        localtion: this.localtion
      }).toPromise().then((response: any) => this.banks = response.data || '');
    }

    if (!this.transaction.data) {
      this.transaction = {
        data: {
          action: TransactionAction.KEY_IN,
          transactionType: TransactionType.DEVICE_ONLY_AIS
        },
        transactionId: this.createOrderService.generateTransactionId(this.apiRequestService.getCurrentRequestId())
      };
    } else if (this.transaction.data.customer && this.transaction.data.billingInformation) {
      this.customerInfoTemp = {
        customer: this.transaction.data.customer,
        billDeliveryAddress: this.transaction.data.billingInformation.billDeliveryAddress,
        receiptInfo: this.transaction.data.receiptInfo,
        action: this.transaction.data.action
      };
    }

    // Test
    // this.callService();
    // this.translationSubscribe = this.translation.onLangChange.pipe(debounceTime(750)).subscribe(() => {
    //   this.callService();
    //   this.amphurs = [];
    //   this.tumbols = [];
    //   this.zipCodes = [];
    //   this.customerAddress.amphur = null;
    //   this.customerAddress.tumbol = null;
    //   this.customerAddress.province = null;
    // });

    // Test
    // this.clearSelectedForm();
    this.getAllZipCodesData();
    this.getAllProvincesData();
    this.createCustomerAddressForm();
  }

  // Test
  // callService(): void {
  //   const billingInformation = this.transaction.data.billingInformation || {};
  //   const customer = billingInformation.billDeliveryAddress || this.transaction.data.customer;
  //   this.http.get('/api/customerportal/newRegister/getAllZipcodes').subscribe((resp: any) => {
  //     this.allZipCodes = resp.data.zipcodes || [];
  //   });
  //   customer.province = customer.province.replace(/มหานคร$/, '');
  //   this.http.get('/api/customerportal/newRegister/getAllProvinces'
  //     , {
  //       params: {
  //         provinceSubType: this.translation.currentLang === 'TH' ? 'THA' : 'ENG'
  //       }
  //     }).subscribe((resp: any) => {
  //       this.provinces = (resp.data.provinces || []);
  //       this.customerAddress = {
  //         homeNo: customer.homeNo,
  //         moo: customer.moo,
  //         mooBan: customer.mooBan,
  //         room: customer.room,
  //         floor: customer.floor,
  //         buildingName: customer.buildingName,
  //         soi: customer.soi,
  //         street: customer.street,
  //         province: customer.province,
  //         amphur: customer.amphur,
  //         tumbol: customer.tumbol,
  //         zipCode: customer.zipCode,
  //       };
  //     });
  // }

  // clearSelectedForm(): void {
  //    this.translationSubscribe = this.translation.onLangChange.pipe(debounceTime(750)).subscribe(() => {
  //     this.amphurs = [];
  //     this.tumbols = [];
  //     this.zipCodes = [];
  //     this.customerAddress.amphur = null;
  //     this.customerAddress.tumbol = null;
  //     this.customerAddress.province = null;
  //   });
  // }

  // Test
  createCustomerAddressForm(): void {
    this.customerAddressForm = this.fb.group({
      province: ['', [Validators.required]],
      amphur: ['', [Validators.required]],
      tumbol: ['', [Validators.required]],
      zipCode: ['', [Validators.required, Validators.maxLength(5)]]
    });

    // this.customerAddressForm.patchValue(this.customerAddress || {});

    this.customerAddressForm.controls['province'].valueChanges.subscribe((provinceName: any) => {
      this.customerAddressForm.patchValue({
        amphur: '',
        tumbol: '',
      });
      this.customerAddressForm.controls['amphur'].enable();
      this.customerAddressForm.controls['tumbol'].disable();
      if (provinceName) {
        console.log('check provinceName : ', provinceName);
        this.alertService.error('check provinceName = ' + JSON.stringify(provinceName));
        this.onProvinceSelected(provinceName);
        // const controlsZipCode = this.customerAddressForm.controls['zipCode'];
        }
      });

      this.customerAddressForm.controls['amphur'].valueChanges.subscribe((amphurName: any) => {
        this.customerAddressForm.patchValue({
          tumbol: '',
        });
        this.customerAddressForm.controls['tumbol'].enable();
        if (amphurName) {
          console.log('check proamphurName : ', amphurName);
          // this.onAmphurSelected(amphurName);
          // const controlsZipCode = this.customerAddressForm.controls['zipCode'];
        }
      });
  }

  // Test
  getAllZipCodesData(): void {
    this.http.get('/api/customerportal/newRegister/getAllZipcodes').subscribe((resp: any) => {
      this.allZipCodes = resp.data.zipcodes || [];
    });
  }

  // Test
  getAllProvincesData(): void {
    this.http.get('/api/customerportal/newRegister/getAllProvinces', {
      params: { provinceSubType: this.translation.currentLang === 'TH' ? 'THA' : 'ENG'}}).subscribe((resp: any) => {
        this.allProvinces = (resp.data.provinces || []);
        this.provinces = (resp.data.provinces || []).map((province: any) => {
          return province.name;
        });
    });
  }

  // Test
  onProvinceSelected(params: any): void {
    console.log('params.zipCode => ', params.zipCode);
    const province = this.getProvinceByName(params);
    this.alertService.error('province1 onProvinceSelected = ' + JSON.stringify(province));
    const req = {
      provinceId: province.id,
      zipcode: params.zipCode
    };
    if (!params.zipCode) {
      delete req.zipcode;
    }

    this.http.get('/api/customerportal/newRegister/queryAmphur', {
      params: req
    }).subscribe((resp: any) => {
      this.amphurs = (resp.data.amphurs || []).map((amphur: any) => {
        return amphur;
      });
    });
  }

  // Test
  onAmphurSelected(params: any): void {
    const province = this.getProvinceByName(params);
    this.alertService.error('province2 onAmphurSelected( = ' + JSON.stringify(province));
    const req = {
      provinceId: province.id,
      amphurName: params.amphurName,
      zipcode: params.zipCode
    };
    if (!params.zipCode) {
      delete req.zipcode;
    }

    this.http.get('/api/customerportal/newRegister/queryTumbol', {
      params: req
    }).subscribe((resp: any) => {
      this.tumbols = (resp.data.tumbols || []).map((tumbol: any) => {
        return tumbol;
      });
    });
  }

  // Test
  getProvinceByName(provinceName: string): any {
    return (this.allProvinces || []).find((prov: any) => prov.name === provinceName) || {};
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  clearstock(): any {
    this.alertService.question('ต้องการยกเลิกรายการขายหรือไม่ การยกเลิก ระบบจะคืนสินค้าเข้าสต๊อคสาขาทันที', 'ตกลง', 'ยกเลิก')
      .then((response: any) => {
        if (response.value === true) {
          this.createOrderService.cancelOrderDT(this.transaction).then((isSuccess: any) => {
            this.transactionService.remove();
            this.router.navigate([ROUTE_BUY_PRODUCT_CAMPAIGN_PAGE], { queryParams: this.priceOption.queryParams });
          });
        }
      }).catch((err: any) => {
        this.transactionService.remove();
      });
  }

  onBack(): any {
    this.transactionService.remove();
    if (this.transaction.data && this.transaction.data.order && this.transaction.data.order.soId) {
      this.clearstock();
    } else {
      this.router.navigate([ROUTE_BUY_PRODUCT_CAMPAIGN_PAGE], { queryParams: this.priceOption.queryParams });
    }
  }

  onNext(): void {
    this.transaction.data.payment = this.paymentDetailTemp.payment;
    this.createAddToCartTrasaction();
  }

  onComplete(customerInfo: any): void {
    this.transaction.data.customer = customerInfo.customer;
    this.transaction.data.billingInformation = {
      billDeliveryAddress: customerInfo.billDeliveryAddress
    };
    this.transaction.data.receiptInfo = customerInfo.receiptInfo;
  }

  onError(error: boolean): void {
    this.isReceiptInformationValid = error;
  }

  public onErrorAddessValid(err: boolean): void {
    this.addessValid = err;
  }

  checkAction(action: string): void {
    if (action === 'READ_CARD') {
      this.transaction.data.action = TransactionAction.READ_CARD;
    } else {
      this.transaction.data.action = TransactionAction.KEY_IN;
    }
  }

  createAddToCartTrasaction(): void {
    this.createOrderService.createAddToCartTrasaction(this.transaction, this.priceOption).then((transaction) => {
      this.transaction = { ...transaction };
      this.transaction.data.device = this.createOrderService.getDevice(this.priceOption);
      this.router.navigate([ROUTE_DEVICE_ONLY_KIOSK_SELECT_MOBILE_CARE_PAGE]);
    }).catch((e) => {
      this.alertService.error(e);
    });
  }

  onPaymentDetailCompleted(payment: any): void {
    this.paymentDetailTemp = payment;
  }

  onPaymentDetailError(valid: boolean): void {
    this.paymentDetailValid = valid;
  }

  isFullPayment(): boolean {
    const trade = this.priceOption.trade || {};
    const payment = (trade.payments || []).find(p => p.method !== 'PP') || {};
    switch (payment.method) {
      case 'CC':
        if (PriceOptionUtils.getInstallmentsFromTrades([trade])) {
          return false;
        } else {
          return true;
        }
      case 'CA':
      case 'CA/CC':
      default:
        return true;
    }
  }

  isNotFormValid(): boolean {
    return !(this.isReceiptInformationValid && this.paymentDetailValid && this.addessValid);
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }

  // Test
  // getProvinces(): string[] {
  //   return (this.provinces || []).map((province: any) => {
  //     return province.name;
  //   });
  // }

  // Test
  // getProvinceByName(provinceName: string): any {
  //   return (this.provinces || []).find((prov: any) => prov.name === provinceName) || {};
  // }

  // Test
  // onProvinceSelected(params: any): void {
  //   const province = this.getProvinceByName(params.provinceName);
  //   this.alertService.error('province1 onProvinceSelected = ' + JSON.stringify(province));
  //   const req = {
  //     provinceId: province.id,
  //     zipcode: params.zipCode
  //   };
  //   if (!params.zipCode) {
  //     delete req.zipcode;
  //   }

  //   this.http.get('/api/customerportal/newRegister/queryAmphur', {
  //     params: req
  //   }).subscribe((resp: any) => {
  //     this.amphurs = (resp.data.amphurs || []).map((amphur: any) => {
  //       return amphur;
  //     });
  //   });
  // }

  // Test
  // onAmphurSelected(params: any): void {
  //   const province = this.getProvinceByName(params.provinceName);
  //   this.alertService.error('province2 onAmphurSelected( = ' + JSON.stringify(province));
  //   const req = {
  //     provinceId: province.id,
  //     amphurName: params.amphurName,
  //     zipcode: params.zipCode
  //   };
  //   if (!params.zipCode) {
  //     delete req.zipcode;
  //   }

  //   this.http.get('/api/customerportal/newRegister/queryTumbol', {
  //     params: req
  //   }).subscribe((resp: any) => {
  //     this.tumbols = (resp.data.tumbols || []).map((tumbol: any) => {
  //       return tumbol;
  //     });
  //   });
  // }

  // Test
  // async onTumbolSelected(params: any): Promise<void> {
  //   const province = this.getProvinceByName(params.provinceName);
  //   await this.alertService.error('province3 onTumbolSelected( = ' + JSON.stringify(province));
  //   this.http.get('/api/customerportal/newRegister/queryZipcode', {
  //     params: {
  //       provinceId: province.id,
  //       amphurName: params.amphurName,
  //       tumbolName: params.tumbolName
  //     }
  //   }).subscribe((resp: any) => {
  //     this.zipCodes = resp.data.zipcodes || [];
  //     this.alertService.error('zipCodes = ' + this.zipCodes);
  //   });
  // }

  // Test
  // onZipCodeSelected(zipCode: string): void {
  //   this.http.get('/api/customerportal/newRegister/getProvinceIdByZipcode', {
  //     params: { zipcode: zipCode }
  //   }).toPromise()
  //     .then((resp: any) => {
  //       const province = this.provinces.find((prov: any) => prov.id === resp.data.provinceId);
  //       if (!province) {
  //         return;
  //       }
  //       this.alertService.error('province4 onZipCodeSelected = ' + JSON.stringify(province));
  //       this.customerAddress = Object.assign(
  //         Object.assign({}, this.customerAddress),
  //         {
  //           province: province.name,
  //           zipCode: zipCode
  //         }
  //       );
  //     });
  // }

}
