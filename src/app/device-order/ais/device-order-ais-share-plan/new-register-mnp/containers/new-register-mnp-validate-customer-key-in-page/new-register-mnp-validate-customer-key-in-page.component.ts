import { Component, OnInit, OnDestroy } from '@angular/core';
import { Params, Router, ActivatedRoute } from '@angular/router';
import { HomeService, CustomerService, AlertService, Utils, User, TokenService, PageLoadingService } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_VALIDATE_CUSTOMER_PAGE, ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_PAYMENT_DETAIL_PAGE } from '../../constants/route-path.constant';
import { Transaction, Prebooking, Order, TransactionType, TransactionAction, Customer } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-new-register-mnp-validate-customer-key-in-page',
  templateUrl: './new-register-mnp-validate-customer-key-in-page.component.html',
  styleUrls: ['./new-register-mnp-validate-customer-key-in-page.component.scss']
})
export class NewRegisterMnpValidateCustomerKeyInPageComponent implements OnInit, OnDestroy {
  params: Params;
  transaction: Transaction;
  priceOption: PriceOption;
  prefixes: string[] = [];
  cardTypes: string[] = [];
  keyInValid: boolean;
  identity: string;
  user: User;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private customerService: CustomerService,
    private alertService: AlertService,
    private utils: Utils,
    private priceOptionService: PriceOptionService,
    private http: HttpClient,
    private tokenService: TokenService,
    private pageLoadingService: PageLoadingService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
    this.user = this.tokenService.getUser();
    this.callService();
    this.activatedRoute.queryParams.subscribe((params: Params) => this.params = params);
  }

  callService(): void {
    this.customerService.queryCardType().then((resp: any) => {
      this.cardTypes = (resp.data.cardTypes || []).map((cardType: any) => cardType.name);
    });

    this.customerService.queryTitleName().then((resp: any) => {
      this.prefixes = (resp.data.titleNames || []).map((prefix: any) => prefix);
    });
  }

  onError(valid: boolean): void {
    this.keyInValid = valid;
  }

  onCompleted(value: any): void {
    console.log('onCompleted', value);
    this.mapCustomerObj(value);
  }

  mapCustomerObj(customer: any): void {
    this.transaction.data.customer = {
      idCardNo: customer.idCardNo,
      idCardType: customer.idCardType,
      titleName: customer.prefix,
      firstName: customer.firstName,
      lastName: customer.lastName,
      birthdate: customer.birthDay + '/' + customer.birthMonth + '/' + customer.birthYear,
      gender: customer.gender,
      homeNo: customer.homeNo,
      moo: customer.moo,
      mooBan: customer.mooban,
      buildingName: customer.buildingName,
      floor: customer.floor,
      room: customer.room,
      street: customer.street || '',
      soi: customer.soi,
      tumbol: customer.tumbol,
      amphur: customer.amphur,
      province: customer.province || customer.provinceName,
      firstNameEn: '',
      lastNameEn: '',
      issueDate: customer.birthdate,
      expireDate: null,
      zipCode: customer.zipCode,
      mainMobile: customer.mainMobile,
      mainPhone: customer.mainPhone,
      billCycle: customer.billCycle,
      caNumber: customer.caNumber,
      mobileNo: '-',
      imageSignature: '',
      imageSmartCard: '',
      imageReadSmartCard: '',
    };
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_VALIDATE_CUSTOMER_PAGE]);
  }

  onNext(): void {
    this.validateCustomerKeyin();
  }

  checkAgeAndExpireCard(): boolean {
    const birthdate = this.transaction.data.customer.birthdate;
    const expireDate = this.transaction.data.customer.expireDate;
    const idCardType = this.transaction.data.customer.idCardType;

    if (this.utils.isLowerAge17Year(birthdate)) {
      this.alertService.error('ไม่สามารถทำรายการได้ เนื่องจากอายุของผู้ใช้บริการต่ำกว่า 17 ปี');
      return false;
    }
    if (this.utils.isIdCardExpiredDate(expireDate)) {
      this.alertService.error('ไม่สามารถทำรายการได้ เนื่องจาก' + idCardType + 'หมดอายุ').then(() => {
        this.onBack();
      });
      return false;
    }
    return true;
  }

  // tslint:disable-next-line: typedef
  validateCustomerKeyin(): any {
    this.pageLoadingService.openLoading();
    const customer = {
      firstName: this.transaction.data.customer.firstName,
      lastName: this.transaction.data.customer.lastName
    };
    const body: any = this.getRequestAddDeviceSellingCart({ customer: customer });
    return this.http.post(`/api/salesportal/add-device-selling-cart`, body).toPromise().then((order: any) => {
      if (order.data && order.data.soId) {// Create SoId
        this.transaction.data = {
          ...this.transaction.data,
          order: { soId: order.data.soId },
        };
      }
    }).then(() => {
      this.checkAgeAndExpireCard();
    }).then(() => {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_PAYMENT_DETAIL_PAGE]);
      this.pageLoadingService.closeLoading();
    });
  }

  getRequestAddDeviceSellingCart(bodyRequest: any): any {
    try {
      const productStock = this.priceOption.productStock;
      const productDetail = this.priceOption.productDetail;
      const preBooking: Prebooking = this.transaction.data.preBooking;
      let subStock;
      const customer: any = bodyRequest;
      const trade: any = this.priceOption.trade;
      if (preBooking && preBooking.preBookingNo) {
        subStock = 'PRE';
      }
      return {
        soCompany: productStock.company || 'AWN',
        locationSource: this.user.locationCode,
        locationReceipt: this.user.locationCode,
        productType: productDetail.productType || 'DEVICE',
        productSubType: productDetail.productSubType || 'HANDSET',
        brand: productDetail.brand || productStock.brand,
        model: productDetail.model || productStock.model,
        color: productStock.color || productStock.colorName,
        priceIncAmt: '' + trade.normalPrice,
        priceDiscountAmt: '' + trade.discount.amount,
        grandTotalAmt: '',
        userId: this.user.username,
        cusNameOrder: `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || '-',
        preBookingNo: preBooking ? preBooking.preBookingNo : '',
        depositAmt: preBooking ? preBooking.depositAmt : '',
        reserveNo: preBooking ? preBooking.reserveNo : '',
        subStockDestination: subStock
      };
    } catch (error) {
      throw error;
    }
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}
