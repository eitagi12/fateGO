import { Component, OnInit, OnDestroy } from '@angular/core';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Transaction, TransactionType, TransactionAction, Prebooking, Order, Customer } from 'src/app/shared/models/transaction.model';
import { Router } from '@angular/router';
import { HomeService, PageLoadingService, TokenService, AlertService, User } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import {
  ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_VALIDATE_CUSTOMER_ID_CARD_PAGE,
  ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_VALIDATE_CUSTOMER_KEY_IN_PAGE,
  ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_PAYMENT_DETAIL_PAGE
} from '../../constants/route-path.constant';
import * as moment from 'moment';
import { ValidateCustomerService } from 'src/app/shared/services/validate-customer.service';

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
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private tokenService: TokenService,
    private priceOptionService: PriceOptionService,
    private alertService: AlertService,
    private validateCustomerService: ValidateCustomerService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.user = this.tokenService.getUser();
    this.homeService.callback = () => {
      this.alertService.question('ต้องการยกเลิกรายการขายหรือไม่ การยกเลิก ระบบจะคืนสินค้าเข้าสต๊อคสาขาทันที', 'ตกลง', 'ยกเลิก')
        .then((response: any) => {
          if (response.value === true) {
            this.returnStock().then(() => {
              window.location.href = '/sales-portal/main-menu';
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

  onHome(): void {
    this.homeService.goToHome();
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

  onNext(): void {
    this.pageLoadingService.openLoading();
    this.validateCustomer().then((data: any) => {
      if (data) {
        const soId: any = this.transaction.data.order || data.order.data;
        this.transaction.data = {
          ...this.transaction.data,
          order: soId
        };
        this.transaction.data.customer = this.validateCustomerService.mapCustomer(data.customer.data);
      }
    }).then(() => {
      if (this.transaction.transactionId) {
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_PAYMENT_DETAIL_PAGE]);
        this.pageLoadingService.closeLoading();
      } else {
        const transactionObject: any = this.buildTransaction(this.transaction.data.transactionType);
        this.validateCustomerService.createTransaction(transactionObject).then((response: any) => {
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
    }).catch((err: any) => {
      if (err.error.developerMessage === 'EB0001 : Data Not Found.') {
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_VALIDATE_CUSTOMER_KEY_IN_PAGE], {
          queryParams: {
            idCardNo: this.identity
          }
        });
      } else {
        this.alertService.error('ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้');
      }
      this.pageLoadingService.closeLoading();
    });
  }

  returnStock(): Promise<void> {
    return new Promise(resolve => {
      const transaction = this.transactionService.load();

      const promiseAll = [];
      if (transaction.data) {
        if (transaction.data.order && transaction.data.order.soId) {
          const order = this.validateCustomerService.clearTempStock(this.priceOption, transaction).catch(() => Promise.resolve());
          promiseAll.push(order);
        }
      }
      Promise.all(promiseAll).then(() => resolve());
    });
  }

  validateCustomer(): any {
    return this.validateCustomerService.queryCustomerInfo(this.identity)
      .then((customerInfo: any) => {
        const cardType: string = this.validateCustomerService.mapCardType(customerInfo.idCardType);
        const transactionType = TransactionType.DEVICE_ORDER_NEW_REGISTER_AIS;
        return this.validateCustomerService.checkValidateCustomer(this.identity, cardType, transactionType)
          .then((customer: any) => {
            return this.validateCustomerService.queryBillingAccount(this.identity)
              .then((resp: any) => {
                const data: any = resp.data || {};
                this.toBillingInformation(data).then((billingInfo: any) => {
                  this.transaction.data.billingInformation = billingInfo;
                });
                return this.validateCustomerService.getCurrentDate().then((sysdate: any) => {
                  if (sysdate) {
                    const isLowerAge: boolean = this.isLowerAge(customer.data.birthdate, sysdate);
                    if (!isLowerAge) {
                      this.alertService.error('ไม่สามารถทำรายการได้ เนื่องจากอายุของผู้ใช้บริการต่ำกว่า 17 ปี');
                    } else {
                      // tslint:disable-next-line: max-line-length
                      const body: any = this.validateCustomerService.getRequestAddDeviceSellingCart(this.user, this.transaction, this.priceOption, { customer: customer });
                      return this.validateCustomerService.addDeviceSellingCart(body).then((order: Order) => {
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
    return this.validateCustomerService.billingNetExtreme(data).then((respBillingNetExtreme: any) => {
      return {
        billCycles: data.billingAccountList,
        billCyclesNetExtreme: respBillingNetExtreme.data
      };
    }).catch(() => {
      return { billCycles: data.billingAccountList };
    });
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
        transactionType: TransactionType.DEVICE_ORDER_NEW_REGISTER_AIS,
        action: TransactionAction.KEY_IN,
        order: order || { soId: '' }
      },
      transactionId: this.transaction.transactionId || ''
    };
    delete this.transaction.data.customer;
  }

  buildTransaction(transactionType: string): any {
    const customer: any = this.transaction.data.customer;
    const order: any = this.transaction.data.order;
    const transactionId = this.transaction.transactionId || this.validateCustomerService.generateTransactionId();

    const transaction: any = {
      transactionId: transactionId,
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

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}
