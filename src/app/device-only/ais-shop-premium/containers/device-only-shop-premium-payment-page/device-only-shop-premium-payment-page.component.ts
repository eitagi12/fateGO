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
  SimCard
} from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Product } from 'src/app/device-only/models/product.model';
import {
  PaymentDetail,
  PaymentDetailBank,
  HomeService,
  ApiRequestService,
  AlertService,
  TokenService,
  User
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
import { FormGroup } from '@angular/forms';
import { ValidateCustomerService } from 'src/app/shared/services/validate-customer.service';
import * as moment from 'moment';

@Component({
  selector: 'app-device-only-shop-premium-payment-page',
  templateUrl: './device-only-shop-premium-payment-page.component.html',
  styleUrls: ['./device-only-shop-premium-payment-page.component.scss']
})
export class DeviceOnlyShopPremiumPaymentPageComponent
  implements OnInit, OnDestroy {
  @Input()
  banks: PaymentDetailBank[];
  @Input()
  omiseBanks: PaymentDetailBank[];

  @Output()
  completed: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  error: EventEmitter<boolean> = new EventEmitter<boolean>();
  profileForm: FormGroup;
  paymentDetailForm: FormGroup;
  isPaymentDetailCollapsed: boolean;
  paymentDetailAdvancePayForm: FormGroup;
  isPaymentDetailAdvancePayCollapsed: boolean;
  installments: PaymentDetailBank[];
  //  banks: PaymentDetailBank[];
  wizards: string[] = WIZARD_DEVICE_ONLY_AIS;
  transaction: Transaction;
  priceOption: PriceOption;
  isReceiptInformationValid: boolean;
  product: Product;
  isSelectBank: any;
  fullPayment: boolean;
  paymentDetail: PaymentDetail;
  paymentDetailTemp: any;
  paymentDetailValid: boolean;
  customerInfoTemp: any;
  user: User;
  localtion: any;
  addessValid: boolean;
  phoneNumber: string;
  taxId: string;
  firstName: string;
  lastName: string;
  seller: Seller;
  simCard: SimCard;
  locationName: string;

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
    private validateCustomerService: ValidateCustomerService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.user = this.tokenService.getUser();
  }

  ngOnInit(): void {
    //  this.createForm();
    this.homeButtonService.initEventButtonHome();
    this.apiRequestService.createRequestId();

    let commercialName = this.priceOption.productDetail.name;
    if (this.priceOption.productStock.color) {
      commercialName += ` สี ${this.priceOption.productStock.color}`;
    }
    // REFACTOR IT'S
    this.paymentDetail = {
      commercialName: commercialName,
      promotionPrice: this.priceOption.productDetail.price,
      installmentFlag: false,
      advancePay: 0,
      qrCode: true,
      omisePayment: this.priceOption.productStock.company !== 'WDS'
    };
    this.http
      .get('/api/salesportal/omise/get-bank')
      .toPromise()
      .then((res: any) => {
        const data = res.data || [];
        this.omiseBanks = data;
      });
    this.localtion = this.tokenService.getUser();
    this.localtion = this.user.locationCode;
    this.http
      .post('/api/salesportal/banks-promotion', {
        localtion: this.localtion
      })
      .toPromise()
      .then((response: any) => (this.banks = response.data || ''));
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
    this.transaction = {
      transactionId: this.createOrderService.generateTransactionId(
        this.apiRequestService.getCurrentRequestId()
      )
    };
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
          this.createOrderService
            .cancelOrderDT(this.transaction)
            .then(() => {
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
    this.callAddToCart(this.priceOption)
      .then(response => {
        if (response.resultCode === 'S') {
          this.transaction.data.order = {
            soId: response.soId
          };
        }
      })
      .catch(error => {
        this.alertNotify(error);
      });
    this.createAddToCartTrasaction();
  }

  private alertNotify(message: string): void {
    this.alertService.notify({ text: message });
  }

  callAddToCart(priceOption: PriceOption): Promise<any> {
    const productStock = priceOption.productStock;
    const productDetail = priceOption.productDetail;
    //  const customer = transaction.data.customer;
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

  generateTransactionId(): any {
    let emptyString: string = '';
    const alphabet: string = 'abcdefghijklmnopqrstuvwxyz';
    while (emptyString.length < 2) {
      emptyString += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    const randomAlphabet: string = emptyString;
    const today: any = moment().format('YYYYMMD');
    const randomNumber: string = Math.floor(Math.random() * 1000000).toString();
    const transactionId: string = randomAlphabet + today + randomNumber;
    return transactionId;
  }
  createAddToCartTrasaction(): void {
    const user: User = this.tokenService.getUser();
    // console.log('this.priceOption ==>', this.priceOption);
    // console.log(
    //   'this.paymentDetailTemp.payment ==>',
    //   this.paymentDetailTemp.payment
    // );
    const product: any = this.priceOption.productStock;
    const productDetail: any = this.priceOption.productDetail;
    const transactionObject: any = {
      transactionId:
        this.transaction.transactionId || this.generateTransactionId(),
      transactionType: 'Premium',
      data: {
        status: {
          code: '001',
          description: 'pending'
        },
        payment: this.paymentDetailTemp.payment,
        productStock: product,
        productDetail: productDetail,
        product: {
          model: productDetail.model,
          amount: 1,
          name: productDetail.name,
          price: productDetail.price,
          colorName: product.color,
          colorCode: product.colorCode,
          productType: productDetail.productType,
          productSubtype: productDetail.productSubtype
        },
        customer: {
          firstName: this.firstName,
          lastName: this.lastName,
          taxId: this.taxId,
          phoneNumber: this.phoneNumber
        }
      },
      create_date: Date.now(),
      create_by: user.username,
      issueBy: user.username
    };
    this.validateCustomerService
      .createTransaction(transactionObject)
      .then((resp: any) => {
        if (resp.data.isSuccess) {
          this.transaction = transactionObject;
          this.router.navigate([ROUTE_SHOP_PREMIUM_SUMMARY_PAGE]);
        } else {
          this.alertService.error('ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้');
        }
      })
      .catch((error: any) => {
        this.alertService.error(error);
      });
  }

  onPaymentDetailCompleted(payment: any): void {
    this.paymentDetailTemp = payment;
    console.log('this.paymentDetailTemp =>', this.paymentDetailTemp);
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

  isNotFormValid(): boolean {
    return !(
      this.firstName &&
      this.lastName &&
      this.taxId &&
      this.phoneNumber &&
      (this.paymentDetailTemp.payment.paymentQrCodeType ||
        this.paymentDetailTemp.payment.paymentBank)
    );
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }
}
