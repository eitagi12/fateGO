import { Component, OnInit, OnDestroy } from '@angular/core';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Transaction, TransactionType, TransactionAction, Prebooking, Order } from 'src/app/shared/models/transaction.model';
import { Router } from '@angular/router';
import { HomeService, PageLoadingService, TokenService, AlertService, User } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { ROUTE_BUY_PRODUCT_CAMPAIGN_PAGE } from 'src/app/buy-product/constants/route-path.constant';
import {
  ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_VALIDATE_CUSTOMER_ID_CARD_PAGE,
  ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_VALIDATE_CUSTOMER_KEY_IN_PAGE,
  ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_PAYMENT_DETAIL_PAGE
} from '../../constants/route-path.constant';
import * as moment from 'moment';

@Component({
  selector: 'app-new-register-mnp-validate-customer-page',
  templateUrl: './new-register-mnp-validate-customer-page.component.html',
  styleUrls: ['./new-register-mnp-validate-customer-page.component.scss']
})
export class NewRegisterMnpValidateCustomerPageComponent implements OnInit, OnDestroy {
  priceOption: PriceOption;
  transaction: Transaction;
  identityValid: boolean = false;
  identity: string;
  user: User;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private http: HttpClient,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private tokenService: TokenService,
    private priceOptionService: PriceOptionService,
    private alertService: AlertService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.user = this.tokenService.getUser();
    this.homeService.callback = () => {
      this.alertService.question('ต้องการยกเลิกรายการขายหรือไม่ การยกเลิก ระบบจะคืนสินค้าเข้าสต๊อคสาขาทันที', 'ตกลง', 'ยกเลิก')
        .then((response: any) => {
          if (response.value === true) {
            this.returnStock().then(() => {
              window.location.href = '/';
            });
          }
        });
    };
  }

  ngOnInit(): void {
    this.createTransaction();
  }
  onError(valid: boolean): void {
    this.identityValid = valid;
  }

  onCompleted(identity: string): void {
    this.identity = identity;
  }

  onReadCard(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_VALIDATE_CUSTOMER_ID_CARD_PAGE]);
  }

  onBack(): void {
    const queryParam = this.priceOption.queryParams;
    if (this.transaction && this.transaction.data && this.transaction.data.order && this.transaction.data.order.soId) {
      this.alertService.question('ต้องการยกเลิกรายการขายหรือไม่ การยกเลิก ระบบจะคืนสินค้าเข้าสต๊อคสาขาทันที', 'ตกลง', 'ยกเลิก')
        .then((response: any) => {
          if (response.value === true) {
            this.returnStock().then(() => {
              this.transactionService.remove();
              window.location.href = `/sales-portal/buy-product/brand/${queryParam.brand}/${queryParam.model}`;
            });
          }
        });
    } else {
      this.transactionService.remove();
      window.location.href = `/sales-portal/buy-product/brand/${queryParam.brand}/${queryParam.model}`;
    }
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    this.validateCustomer().then((data: any) => {
      this.transaction.data = {
        ...this.transaction.data,
        order: data.order.data,
      };
      this.mapCustomer(data.customer.data);
    }).then(() => {
      if (this.transaction.transactionId) {
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_PAYMENT_DETAIL_PAGE]);
        this.pageLoadingService.closeLoading();
      } else {
        const transactionObject: any = this.buildTransaction(this.transaction.data.transactionType);
        this.http.post(`/api/salesportal/device-order/create-transaction`, transactionObject)
          .toPromise().then((response: any) => {
            this.pageLoadingService.closeLoading();
            if (response.data.isSuccess) {
              this.transaction = transactionObject;
              this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_PAYMENT_DETAIL_PAGE]);
            } else {
              this.alertService.error('ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้');
              throw new Error('ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้');
            }
          }).catch((error: any) => {
            this.pageLoadingService.closeLoading();
            throw new Error(error);
          });
      }
    });
  }

  returnStock(): Promise<void> {
    return new Promise(resolve => {
      const transaction = this.transactionService.load();

      const promiseAll = [];
      if (transaction.data) {
        if (transaction.data.order && transaction.data.order.soId) {
          const order = this.http.post('/api/salesportal/device-sell/item/clear-temp-stock', {
            location: this.priceOption.productStock.location,
            soId: transaction.data.order.soId,
            transactionId: transaction.transactionId
          }).toPromise().catch(() => Promise.resolve());
          promiseAll.push(order);
        }
      }
      Promise.all(promiseAll).then(() => resolve());
    });
  }

  validateCustomer(): any {
    return this.http.get(`/api/customerportal/newRegister/${this.identity}/queryCustomerInfo`)
      .toPromise().then((customerInfo: any) => {
        const transactionType: string = 'NewRegisterAIS';
        const cardType: string = this.mapCardType(customerInfo.idCardType);
        // tslint:disable-next-line: max-line-length
        return this.http.get(`/api/customerportal/validate-customer-new-register?identity=${this.identity}&idCardType=${cardType}&transactionType=${transactionType}`)
          .toPromise().then((customer: any) => {
            return this.http.get(`/api/customerportal/newRegister/${this.identity}/queryBillingAccount`).toPromise()
              .then((resp: any) => {
                const data: any = resp.data || {};
                this.toBillingInformation(data).then((billingInfo) => {
                  this.transaction.data.billingInformation = billingInfo;
                });
                return this.http.get(`/api/customerportal/currentDate`)
                  .toPromise().then((sysdate: any) => {
                    if (sysdate) {
                      const isLowerAge: boolean = this.isLowerAge(customer.data.birthdate, sysdate);
                      if (!isLowerAge) {
                        this.alertService.error('อายุไม่ถึง 17 ปี');
                        throw new Error('อายุไม่ถึง 17 ปี');
                      } else {
                        const body: any = this.getRequestAddDeviceSellingCart({ customer: customer });
                        return this.http.post(`/api/salesportal/add-device-selling-cart`, body)
                          .toPromise().then((order: Order) => {
                            return {
                              order,
                              customer,
                              customerInfo,
                            };
                          });
                      }
                    }
                  });
              });
          });
      });
  }

  toBillingInformation(data: any): any {
    return this.http.post('/api/customerportal/verify/billingNetExtreme', {
      businessType: '1',
      listBillingAccount: data.billingAccountList
    }).toPromise().then((respBillingNetExtreme: any) => {
      return {
        billCycles: data.billingAccountList,
        billCyclesNetExtreme: respBillingNetExtreme.data
      };
    }).catch(() => {
      return { billCycles: data.billingAccountList };
    });
  }

  getRequestAddDeviceSellingCart(bodyRequest: any): any {
    try {
      const productStock = this.priceOption.productStock;
      const productDetail = this.priceOption.productDetail;
      const preBooking: Prebooking = this.transaction.data.preBooking;
      let subStock;
      const customer: any = bodyRequest.customer.data;
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

  isLowerAge(birthdate: string, currentDate?: Date): boolean {
    const b: moment.Moment = moment(birthdate, 'DD/MM/YYYY');
    const c: moment.Moment = moment(currentDate).add(543, 'years');
    if (b.isValid()) {
      const age: any = c.diff(b, 'years');
      const isLegal: any = (age >= 17);
      return isLegal;
    } else {
      throw new Error('กรอกวันเกิดไม่ถูกต้อง กรุณากรอกใหม่อีกครั้ง');
    }
  }

  createTransaction(): void {
    let order: Order;
    let transactionId: string;
    if (this.transaction.data && this.transaction.data.order && this.transaction.data.order.soId) {
      transactionId = this.transaction.transactionId;
      order = this.transaction.data.order;
    }
    this.transaction = {
      data: {
        transactionType: TransactionType.DEVICE_ORDER_EXISTING_AIS,
        action: TransactionAction.KEY_IN,
        order: order
      }
    };
    delete this.transaction.data.customer;

  }

  buildTransaction(transactionType: string): any {
    const customer: any = this.transaction.data.customer;
    const order: any = this.transaction.data.order;

    const transaction: any = {
      transactionId: this.generateTransactionId(),
      data: {
        customer: customer,
        order: order,
        status: {
          code: '001',
          description: 'pending'
        },
        transactionType: transactionType,
        billingInformation: this.transaction.data.billingInformation
      },
      create_date: Date.now(),
      create_by: this.user.username,
      issueBy: this.user.username
    };
    return transaction;
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

  mapCustomer(customer: any): void {
    this.transaction.data.customer = {
      idCardNo: this.identity,
      idCardType: customer.idCardType,
      titleName: customer.titleName,
      firstName: customer.firstName,
      lastName: customer.lastName,
      birthdate: customer.birthdate,
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
      imageSignature: '',
      imageSmartCard: '',
      imageReadSmartCard: '',
    };
  }

  mapCardType(idCardType: string): string {
    idCardType = idCardType ? idCardType : 'ID_CARD';
    const mapCardType: any = {
      CERT_FOUND: 'หนังสือจัดตั้งสมาคม / มูลนิธิ',
      EMB_LET: 'หนังสือออกจากสถานทูต',
      GOV_LET: 'หนังสือออกจากหน่วยราชการ',
      HILL_CARD: 'บัตรประจำตัวคนบนที่ราบสูง',
      ID_CARD: 'บัตรประชาชน',
      IMM_CARD: 'บัตรประจำตัวคนต่างด้าว',
      MONK_CERT: 'ใบสุทธิพระ',
      PASSPORT: 'หนังสือเดินทาง',
      ROY_LET: 'หนังสือออกจากสำนักพระราชวัง',
      STA_LET: 'หนังสือออกจากรัฐวิสาหกิจ',
      TAX_ID: 'เลขที่ประจำตัวผู้เสียภาษีอากร'
    };
    return mapCardType[idCardType];
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }
}
