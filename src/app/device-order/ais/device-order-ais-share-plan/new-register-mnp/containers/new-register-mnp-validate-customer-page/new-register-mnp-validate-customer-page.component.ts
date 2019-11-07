import { Component, OnInit, OnDestroy } from '@angular/core';
import { Transaction, TransactionType, TransactionAction, Order } from 'src/app/shared/models/transaction.model';
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
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Utils } from 'mychannel-shared-libs';
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
  // tslint:disable-next-line: max-line-length
  priceOptionMock: any = require('src/app/device-order/ais/device-order-ais-share-plan/new-register-mnp/containers/new-register-mnp-validate-customer-page/priceOption.json');
  order: Order;
  transactionId: string;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private tokenService: TokenService,
    private priceOptionService: PriceOptionService,
    private alertService: AlertService,
    private validateCustomerService: ValidateCustomerService,
    private utils: Utils
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load() ? this.priceOptionService.load() : this.priceOptionMock;
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
    localStorage.setItem('priceOption', JSON.stringify(this.priceOptionMock));
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
        const soId: any = data.order.data || data.order;
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
        const transactionObject: any = this.validateCustomerService.buildTransaction({
            transaction: this.transaction,
            transactionType: TransactionType.DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN // Share
          }
        );
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
    }).catch((error: any) => {
      if (error.error && error.error.developerMessage === 'EB0001 : Data Not Found.') {
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_VALIDATE_CUSTOMER_KEY_IN_PAGE], {
          queryParams: {
            idCardNo: this.identity
          }
        });
      } else {
        this.alertService.error('คุณไม่สามารถทำรายการเปิดเบอร์ใหม่ได้ Sorry this ID Card is Expired');
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
        const transactionType = TransactionType.DEVICE_ORDER_NEW_REGISTER_AIS; // New
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
                    const isLowerAge: boolean = this.validateCustomerService.isLowerAge(customer.data.birthdate, sysdate);
                    if (!isLowerAge) {
                      this.alertService.error('ไม่สามารถทำรายการได้ เนื่องจากอายุของผู้ใช้บริการต่ำกว่า 17 ปี');
                      throw new Error('ไม่สามารถทำรายการได้ เนื่องจากอายุของผู้ใช้บริการต่ำกว่า 17 ปี');
                    } else {
                      if (this.order) {
                        return {
                          order: this.order,
                          customer,
                          customerInfo
                        };
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
