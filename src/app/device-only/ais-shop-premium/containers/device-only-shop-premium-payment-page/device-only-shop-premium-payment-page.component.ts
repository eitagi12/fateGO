import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { Router } from '@angular/router';
import { WIZARD_DEVICE_ONLY_AIS } from 'src/app/device-only/constants/wizard.constant';
import {
  Transaction,
  Seller,
  SimCard,
  TransactionType,
  TransactionAction,
} from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Product } from 'src/app/device-only/models/product.model';
import {
  HomeService,
  ApiRequestService,
  AlertService,
  TokenService,
  User,
  PageLoadingService
} from 'mychannel-shared-libs';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { CreateOrderService } from 'src/app/device-only/services/create-order.service';
import { HomeButtonService } from 'src/app/device-only/services/home-button.service';
import {
  ROUTE_BUY_PREMIUM_CAMPAIGN_PAGE,
  ROUTE_BUY_PREMIUM_PRODUCT_PAGE
} from 'src/app/buy-premium/constants/route-path.constant';
import { ROUTE_SHOP_PREMIUM_SUMMARY_PAGE } from '../../constants/route-path.constant';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { Utils } from 'mychannel-shared-libs';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';

export interface PaymentDetail {
  name: string;
  price: number;
  qrCode?: boolean;
}

export interface PaymentDetailBank {
  abb: string;
  imageUrl: string;
  installment: string;
  name: string;
  remark: string;
}

@Component({
  selector: 'app-device-only-shop-premium-payment-page',
  templateUrl: './device-only-shop-premium-payment-page.component.html',
  styleUrls: ['./device-only-shop-premium-payment-page.component.scss']
})
export class DeviceOnlyShopPremiumPaymentPageComponent
  implements OnInit, OnDestroy {
  // @Input()
  // banks: PaymentDetailBank[];

  banks: PaymentDetailBank[];
  paymentDetail: PaymentDetail;
  customerAddressForm: FormGroup;
  paymentDetailForm: FormGroup;
  isPaymentDetailCollapsed: boolean;
  isPaymentDetailAdvancePayCollapsed: boolean;
  wizards: string[] = WIZARD_DEVICE_ONLY_AIS;
  transaction: Transaction;
  priceOption: PriceOption;
  isReceiptInformationValid: boolean;
  product: Product;
  paymentDetailTemp: any;
  paymentDetailValid: boolean;
  customerInfoTemp: any;
  user: User;
  phoneNumber: string;
  taxId: string;
  firstName: string;
  lastName: string;
  seller: Seller;
  simCard: SimCard;
  locationName: string;
  payment: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private utils: Utils,
    private homeService: HomeService,
    private apiRequestService: ApiRequestService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private createOrderService: CreateOrderService,
    private alertService: AlertService,
    private homeButtonService: HomeButtonService,
    private tokenService: TokenService,
    private sharedTransactionService: SharedTransactionService,
    private pageLoadingService: PageLoadingService,
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.user = this.tokenService.getUser();
  }

  ngOnInit(): void {
    this.createForm();
    this.createTransaction();
    this.homeButtonService.initEventButtonHome();
    this.apiRequestService.createRequestId();
    let name = this.priceOption.productDetail.name;
    const price = this.priceOption.productDetail.price;
    if (this.priceOption.productStock.color) {
      name += ` สี ${this.priceOption.productStock.color}`;
    }
    // REFACTOR IT'S
    this.paymentDetail = {
      name: name,
      price: price,
      qrCode: true
    };
    this.getBanksPromotion();
    this.getLocationByCode();
  }

  getBanksPromotion(): void {
    this.http
      .post('/api/salesportal/banks-promotion', {
        localtion: this.user.locationCode
      })
      .toPromise()
      .then((response: any) => (this.banks = response.data || ''));
  }

  getLocationByCode(): void {
    this.http
      .get(`/api/salesportal/location-by-code?code=${this.user.locationCode}`)
      .toPromise()
      .then((response: any) => {
        this.seller = {
          locationName: response.data.displayName,
          locationCode: this.user.locationCode,
          sellerNo: this.user.ascCode
        };
        this.locationName = this.seller.locationName;
      });
  }

  createForm(): void {
    this.customerAddressForm = this.fb.group({
      idCardNo: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[1-8]\d{12}$/),
          this.customerValidate.bind(this)
        ]
      ],
      telNo: [
        '',
        [
          Validators.required,
          Validators.pattern(/^0[6-9]{1}[0-9]{8}/),
          this.customerValidate.bind(this)
        ]
      ]
    });

    this.paymentDetailForm = this.fb.group(
      {
        paymentQrCodeType: [''],
        paymentType: ['', Validators.required],
        paymentForm: [''],
        paymentBank: Validators.required
      },
      { validator: this.customValidate.bind(this) }
    );
    // Events
    this.paymentDetailForm.controls['paymentType'].valueChanges.subscribe(
      (obs: any) => {
        this.changePaymentType(obs, this.paymentDetailForm);
        this.onPaymentDetailCompleted(this.paymentDetailForm.value);
      }
    );

    this.paymentDetailForm.controls['paymentBank'].valueChanges.subscribe(
      (obs: any) => {
        this.changePaymentBank(this.paymentDetailForm);
        this.onPaymentDetailCompleted(this.paymentDetailForm.value);
      }
    );

    this.paymentDetailForm.controls['paymentQrCodeType'].valueChanges.subscribe(
      (obs: any) => {
        this.changePaymentQrCodeType(obs, this.paymentDetailForm);
        this.onPaymentDetailCompleted(this.paymentDetailForm.value);
      }
    );
    this.paymentDetailForm.controls['paymentForm'].disable();
  }

  customValidate(group: FormGroup): any {
    switch (group.value.paymentType) {
      case 'QR_CODE':
        if (group.value.paymentQrCodeType) {
          return { field: 'paymentQrCodeType' };
        }
        break;
      case 'CREDIT':
        if (group.value.paymentBank) {
          return { field: 'paymentBank' };
        }
        break;
    }
    return null;
  }

  changePaymentType(paymentType: string, sourceControl: any): void {
    sourceControl.patchValue(
      {
        paymentQrCodeType: paymentType ? paymentType : '',
        paymentBank: '',
      },
      { emitEvent: false }
    );
  }

  changePaymentQrCodeType(qrCodeType: string, sourceControl: any): void {
    sourceControl.patchValue(
      {
        paymentQrCodeType: qrCodeType ? qrCodeType : ''
      },
      { emitEvent: false }
    );
  }

  changePaymentBank(sourceControl: any): void {
    sourceControl.patchValue(
      {
        paymentQrCodeType: ''
      },
      { emitEvent: false }
    );
  }

  getBanks(): PaymentDetailBank[] {
    return (this.banks || []).reduce((prev: any, curr: any) => {
      const exists = prev.find(p => p.abb === curr.abb);
      if (!exists) {
        prev.push(curr);
      }
      return prev;
    }, []);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  clearstock(): any {
    this.alertService
      .question(
        'ต้องการยกเลิกรายการขายหรือไม่ การยกเลิก ระบบจะคืนสินค้าเข้าสต๊อคสาขาทันที',
        'ตกลง',
        'ยกเลิก'
      )
      .then((response: any) => {
        if (response.value === true) {
          this.createOrderService.cancelOrderDT(this.transaction).then(() => {
            this.transactionService.remove();
            this.router.navigate([ROUTE_BUY_PREMIUM_PRODUCT_PAGE], {
              queryParams: this.priceOption.queryParams
            });
          });
        }
      })
      .catch(() => {
        this.transactionService.remove();
      });
  }

  onBack(): any {
    this.transactionService.remove();
    if (
      this.transaction.data &&
      this.transaction.data.order &&
      this.transaction.data.order.soId
    ) {
      this.clearstock();
    } else {
      this.router.navigate([ROUTE_BUY_PREMIUM_CAMPAIGN_PAGE], {
        queryParams: this.priceOption.queryParams
      });
    }
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    this.callAddToCart(this.priceOption)
      .then(response => {
        if (response.resultCode === 'S') {
          this.transaction.data.order = {
            soId: response.soId
          };
          this.createAddToCartTrasaction();
        } else {
          this.alertService.error(response.resultMessage);
        }
      });
  }

  callAddToCart(priceOption: PriceOption): Promise<any> {
    const productStock = priceOption.productStock;
    const productDetail = priceOption.productDetail;
    const cusNameOrder =
      this.firstName && this.lastName
        ? `${this.firstName} ${this.lastName}`
        : '-';
    const color = productStock.colorName || productStock.color;
    const requestData: any = {
      soCompany: productStock.company || 'AWN',
      locationSource: this.user.locationCode,
      locationReceipt: this.user.locationCode,
      productType: productDetail.productType || 'PREMIUM',
      productSubType: productDetail.productSubType || 'N/A',
      brand: productDetail.brand || productStock.brand,
      model: productDetail.model,
      color: color,
      userId: this.user.username,
      cusNameOrder: cusNameOrder,
      soChannelType: 'CSP',
      soDocumentType: 'RESERVED'
    };

    return this.http
      .post('/api/salesportal/add-to-cart', requestData)
      .toPromise()
      .then((res: any) => res.data);
  }

  createAddToCartTrasaction(): void {
    const customer: any = {
      firstName: this.firstName,
      lastName: this.lastName,
      idCardNo: this.taxId,
    };
    const receiptInfo: any = {
      telNo: this.phoneNumber,
      taxId: this.taxId,
    };
    this.transaction.data.seller = { ...this.seller };
    this.transaction.data.payment = { paymentForm: 'FULL', ...this.paymentDetailTemp };
    this.transaction.data.receiptInfo = { ...receiptInfo };
    this.transaction.data.customer = { ...customer };

    this.sharedTransactionService.createSharedTransactionShopPremium(this.transaction, this.priceOption)
      .then(() => {
        this.pageLoadingService.closeLoading();
        this.router.navigate([ROUTE_SHOP_PREMIUM_SUMMARY_PAGE]);
      });
  }

  createTransaction(): void {
    this.transaction = {
      data: {
        transactionType: TransactionType.DEVICE_ONLY_AIS,
        action: TransactionAction.KEY_IN,
      }
    };
  }

  onPaymentDetailCompleted(payment: any): void {
    this.payment = payment;
    this.paymentDetailTemp = payment;
  }

  onPaymentDetailError(valid: boolean): void {
    this.paymentDetailValid = valid;
  }

  inputFirstName(firstName: string): void {
    this.firstName = firstName;
  }
  inputLastName(lastName: string): void {
    this.lastName = lastName;
  }
  inputTaxid(taxId: string): void {
    this.taxId = taxId;
  }

  inputPhoneNumber(phoneNumber: string): void {
    this.phoneNumber = phoneNumber;
  }

  customerValidate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const length: number = control.value.length;

    if (length === 10) {
      if (this.utils.isMobileNo(value)) {
        return null;
      } else {
        return {
          message: 'กรุณากรอกหมายเลขโทรศัพท์ให้ถูกต้อง'
        };
      }
    } else if (length === 13) {
      if (this.utils.isThaiIdCard(value)) {
        return null;
      } else {
        return {
          message: 'กรุณากรอกเลขบัตรประชาชนให้ถูกต้อง'
        };
      }
    }
  }

  isDisableNext(): boolean {
    if (
      this.firstName &&
      this.lastName &&
      this.paymentDetailTemp && this.phoneNumber && this.taxId
    ) {
      const id = this.taxId.length;
      const tel = this.phoneNumber.length;
      if (id === 13 && tel === 10 && (this.paymentDetailTemp.paymentQrCodeType !== this.paymentDetailTemp.paymentType)) {
        return true;
      }
    }
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }
}
