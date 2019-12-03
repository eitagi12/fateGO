import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { PageLoadingService, TokenService, AlertService, User } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import {
  ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_VALIDATE_CUSTOMER_ID_CARD_PAGE,
  ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_VALIDATE_CUSTOMER_KEY_IN_PAGE,
  ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_PAYMENT_DETAIL_PAGE
} from '../../constants/route-path.constant';
import { ValidateCustomerService } from 'src/app/shared/services/validate-customer.service';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Utils } from 'mychannel-shared-libs';
import { Transaction, Order, TransactionType, TransactionAction } from 'src/app/shared/models/transaction.model';
import { HttpClient } from '@angular/common/http';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { RemoveCartService } from '../../services/remove-cart.service';

@Component({
  selector: 'app-new-register-mnp-validate-customer-page',
  templateUrl: './new-register-mnp-validate-customer-page.component.html',
  styleUrls: ['./new-register-mnp-validate-customer-page.component.scss']
})
export class NewRegisterMnpValidateCustomerPageComponent implements OnInit, OnDestroy {
  priceOption: any;
  transaction: Transaction;
  identityValid: boolean = false;
  identity: string;
  user: User;
  order: Order;
  transactionId: string;
  // priceOptionMock: any = require('../new-register-mnp-validate-customer-page/priceOption-Mock.json');
  constructor(
    private router: Router,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private tokenService: TokenService,
    private priceOptionService: PriceOptionService,
    private alertService: AlertService,
    private validateCustomerService: ValidateCustomerService,
    private utils: Utils,
    private http: HttpClient,
    private removeCartService: RemoveCartService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.user = this.tokenService.getUser();
  }

  ngOnInit(): void {
    // localStorage.setItem('priceOption', JSON.stringify(this.priceOptionMock));
    this.createTransaction();
  }
  onError(valid: boolean): void {
    this.identityValid = valid;
  }

  onCompleted(identity: string): void {
    this.identity = identity;
  }

  validateCustomerIdentity(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const length: number = control.value.length;
    if (length === 13) {
      if (this.utils.isThaiIdCard(value)) {
        return null;
      } else {
        return {
          message: 'กรุณากรอกเลขบัตรประชาชนให้ถูกต้อง',
        };
      }
    } else {
      return {
        message: 'กรุณากรอกรูปแบบให้ถูกต้อง',
      };
    }
  }

  onReadCard(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_VALIDATE_CUSTOMER_ID_CARD_PAGE]);
  }

  onHome(): void {
    this.removeCartService.backToReturnStock('/', this.transaction);
  }

  onBack(): void {
    const queryParam = this.priceOption.queryParams;
    const url = `/sales-portal/buy-product/brand/${queryParam.brand}/${queryParam.model}`;
    this.removeCartService.backToReturnStock(url, this.transaction);
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    this.validateCustomer().catch((error: any) => {
      console.log(error);
      if (error.error.developerMessage === 'EB0001 : Data Not Found.') {
        this.pageLoadingService.closeLoading();
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_VALIDATE_CUSTOMER_KEY_IN_PAGE], {
          queryParams: {
            idCardNo: this.identity
          }
        });
      } else {
        this.pageLoadingService.closeLoading();
        this.alertService.error(error);
      }
    });
  }

  validateCustomer(): any {
    return this.validateCustomerService.queryCustomerInfo(this.identity)
      .then((customerInfo: any) => {
        const cardType: string = this.mapCardType(customerInfo.idCardType);
        const transactionType = TransactionType.DEVICE_ORDER_NEW_REGISTER_AIS; // New
        return this.validateCustomerService.checkValidateCustomer(this.identity, cardType, transactionType)
          .then((customer: any) => {
            return this.validateCustomerService.queryBillingAccount(this.identity)
              .then((resp: any) => {
                const data: any = resp.data || {};
                this.toBillingInformation(data).then((billingInfo: any) => {
                  this.transaction.data.billingInformation = billingInfo;
                });
                const birthdate = customer.data.birthdate;
                if (this.utils.isLowerAge17Year(birthdate)) {
                  this.pageLoadingService.closeLoading();
                  this.alertService.error('ไม่สามารถทำรายการได้ เนื่องจากอายุของผู้ใช้บริการต่ำกว่า 17 ปี');
                } else {
                  if (this.order) {
                    this.setTransaction(this.order, customer);
                  } else {
                    const body: any = this.validateCustomerService.getRequestAddDeviceSellingCart(
                      this.user,
                      this.transaction,
                      this.priceOption,
                      { customer: customer }
                    );
                    return this.validateCustomerService.addDeviceSellingCartSharePlan(body).then((order: Order) => {
                      this.setTransaction(order, customer);
                    });
                  }
                }
              });
          });
      });
  }

  setTransaction(order: any, customer: any): void {
    const soId: any = order;
    this.transaction.data = {
      ...this.transaction.data,
      order: soId
    };
    this.transaction.data.customer = this.mapCustomer(customer.data);
    if (this.transaction.transactionId) {
      this.pageLoadingService.closeLoading();
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_PAYMENT_DETAIL_PAGE]);
    } else {
      const transactionObject: any = this.validateCustomerService.buildTransaction({
        transaction: this.transaction,
        transactionType: TransactionType.DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN // Share
      });
      this.validateCustomerService.createTransaction(transactionObject).then((response: any) => {
        this.pageLoadingService.closeLoading();
        if (response.data.isSuccess) {
          this.transaction = transactionObject;
          this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_PAYMENT_DETAIL_PAGE]);
        } else {
          this.alertService.error('ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้');
        }
      }).catch((error: any) => {
        this.pageLoadingService.closeLoading();
        this.alertService.error(error);
      });
    }
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

  mapCustomer(customer: any, transaction?: any): any {
    return {
      idCardNo: customer.idCardNo,
      idCardType: (customer.idCardType === 'บัตรประชาชน') ? 'บัตรประชาชน' : this.mapCardType(customer.idCardType) || '',
      titleName: customer.prefix || customer.titleName || '',
      firstName: customer.firstName || '',
      lastName: customer.lastName || '',
      birthdate: customer.birthdate || customer.birthDay + '/' + customer.birthMonth + '/' + customer.birthYear || '',
      gender: customer.gender || '',
      homeNo: customer.homeNo || '',
      moo: customer.moo || '',
      mooBan: customer.mooban || '',
      buildingName: customer.buildingName || '',
      floor: customer.floor || '',
      room: customer.room || '',
      street: customer.street || '',
      soi: customer.soi || '',
      tumbol: customer.tumbol || '',
      amphur: customer.amphur,
      province: customer.province || customer.provinceName || '',
      firstNameEn: '',
      lastNameEn: '',
      issueDate: customer.birthdate || customer.issueDate || '',
      // tslint:disable-next-line: max-line-length
      expireDate: customer.expireDate || customer.expireDay ? customer.expireDay + '/' + customer.expireMonth + '/' + customer.expireYear : '',
      zipCode: customer.zipCode || '',
      mainMobile: customer.mainMobile || '',
      mainPhone: customer.mainPhone || '',
      billCycle: customer.billCycle || '',
      caNumber: customer.caNumber || '',
      mobileNo: '',
      imageSignature: '',
      imageSmartCard: '',
      imageReadSmartCard: customer.imageReadSmartCard ? customer.imageReadSmartCard : transaction ? transaction.imageReadSmartCard : '',
      imageSignatureWidthCard: ''
    };
  }

  toBillingInformation(data: any): any {
    return this.validateCustomerService.billingNetExtreme(data).then((respBillingNetExtreme: any) => {
      return {
        billCycles: data.billingAccountList,
        billCyclesNetExtreme: respBillingNetExtreme.data
      };
    }).catch(() => {
      return { billCycles: data.billingAccountList };
    });
  }

  createTransaction(): void {
    if (this.transaction.data && this.transaction.data.order && this.transaction.data.order.soId) {
      this.transactionId = this.transaction.transactionId;
      this.order = this.transaction.data.order;
    }
    this.transaction = {
      data: {
        transactionType: TransactionType.DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN, // Share
        action: TransactionAction.KEY_IN,
        order: this.order
      },
      transactionId: this.transaction.transactionId
    };
    delete this.transaction.data.customer;
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}
