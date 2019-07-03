import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { HomeService, PageLoadingService, TokenService, Utils, AlertService, User } from 'mychannel-shared-libs';

import { ROUTE_BUY_PRODUCT_CAMPAIGN_PAGE } from 'src/app/buy-product/constants/route-path.constant';
import {
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_VALIDATE_CUSTOMER_ID_CARD_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_CURRENT_INFO_PAGE
} from '../../constants/route-path.constant';
import { environment } from 'src/environments/environment';

import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Transaction, TransactionType, TransactionAction } from 'src/app/shared/models/transaction.model';

import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PrivilegeService } from 'src/app/device-order/services/privilege.service';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
const Moment = moment;
@Component({
  selector: 'app-device-order-ais-pre-to-post-validate-customer-page',
  templateUrl: './device-order-ais-pre-to-post-validate-customer-page.component.html',
  styleUrls: ['./device-order-ais-pre-to-post-validate-customer-page.component.scss']
})
export class DeviceOrderAisPreToPostValidateCustomerPageComponent implements OnInit, OnDestroy {

  priceOption: PriceOption;

  transaction: Transaction;

  identityValid: boolean = false;
  identity: string;
  user: User;

  constructor(
    private utils: Utils,
    private router: Router,
    private homeService: HomeService,
    private http: HttpClient,
    private alertService: AlertService,
    private tokenService: TokenService,
    private translateService: TranslateService,
    private privilegeService: PrivilegeService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService
  ) {
    this.user = this.tokenService.getUser();
    this.priceOption = this.priceOptionService.load();

    this.homeService.callback = () => {

      const url = this.router.url;
      if (url.indexOf('result') !== -1) {
        this.homeHandler();
      } else {
        this.alertService.question(this.translateService.instant('ท่านต้องการยกเลิกการซื้อสินค้าหรือไม่'))
          .then((data: any) => {
            if (!data.value) {
              return false;
            }
            // Returns stock (sim card, soId) todo...
            return this.returnStock().then(() => true);
          })
          .then((isNext: boolean) => {
            if (isNext) {
              this.homeHandler();
            }
          });
      }
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
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_VALIDATE_CUSTOMER_ID_CARD_PAGE]);
  }

  onBack(): void {
    this.alertService.question(this.translateService.instant('ท่านต้องการยกเลิกการซื้อสินค้าหรือไม่'))
      .then((data: any) => {
        if (!data.value) {
          return false;
        }
        // Returns stock (sim card, soId) todo...
        return this.returnStock().then(() => true);
      })
      .then((isNext: boolean) => {
        if (isNext) {
          this.router.navigate([ROUTE_BUY_PRODUCT_CAMPAIGN_PAGE], { queryParams: this.priceOption.queryParams });
        }
      });
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    const subscriberId: string = this.identity;
    const orderType: string = 'Port - Out';
    const isProduction: any = environment.name !== 'PROD' && environment.name !== 'SIT' ? true : false;
    const isStartDt: any = isProduction === true ? 30 : 3;
    const startDt: string = encodeURIComponent(moment().subtract(isStartDt, 'days').format('YYYYMMDD HH:mm:ss'));
    const endDt: string = encodeURIComponent(moment().format('YYYYMMDD HH:mm:ss'));
    this.http.get(`/api/customerportal/newRegister/history-order`, {
      params: {
        subscriberId: subscriberId,
        orderType: orderType,
        startDt: startDt,
        endDt: endDt
      }
    })
      .toPromise()
      .then((resp: any) => {
        return (resp.data || []).find((order: any) => {
          return order.statusCode === 'Submit for Approve'
            || order.statusCode === 'Pending'
            || order.statusCode === 'Submitted'
            || order.statusCode === 'Request'
            || order.statusCode === 'Saveteam'
            || order.statusCode === 'QueryBalance'
            || order.statusCode === 'Response'
            || order.statusCode === 'Notification'
            || order.statusCode === 'BAR Processing'
            || order.statusCode === 'BAR'
            || order.statusCode === 'Terminating';
        });
      }).then((order: any) => {
        if (order) {
          const createDate = moment(order.createDate, 'YYYYMMDD').format('DD/MM/YYYY');
          return this.alertService.error(`ระบบไม่สามารถทำรายการได้ <br>หมายเลข ${this.identity}
          อยู่ระหว่างย้ายค่ายไปยังผู้ให้บริการรายอื่น (True, DTAC) (ทำรายการวันที่${createDate})`);
        }
        return this.checkCustomerProfile(this.identity);

      })
      .catch(() => this.checkCustomerProfile(this.identity));

  }
  checkCustomerProfile(mobileNo: any): void {
    if (this.utils.isMobileNo(this.identity)) {
      this.http.get('/api/customerportal/validate-customer-mobile-no-pre-to-post', {
        params: {
          mobileNo: this.identity
        }
      }).toPromise()
        .then(() => {
          return this.privilegeService.checkAndGetPrivilegeCode(this.identity, this.priceOption.trade.ussdCode)
            .then((respPrivilegeCode) => {
              this.transaction.data.simCard = { mobileNo: this.identity, persoSim: false, privilegeCode: respPrivilegeCode };
              this.transaction.data.action = TransactionAction.KEY_IN_REPI;
            })
            .catch((msg: string) => {
              return this.alertService.error(msg).then(() => true);
            });
        })
        .then((isError: boolean) => {
          if (isError) {
            return;
          }
          this.pageLoadingService.closeLoading();
          this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_CURRENT_INFO_PAGE]);
        })
        .catch((resp: any) => {
          this.pageLoadingService.closeLoading();
          this.alertService.error(resp.error.developerMessage);
          const error = resp.error || [];
          if (error && error.errors && typeof error.errors === 'string') {
            this.alertService.notify({
              type: 'error',
              html: error.errors
            });
          } else {
            Promise.reject(resp);
          }
        });
    }
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  customerValidate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (this.utils.isMobileNo(value)) {
      return null;
    } else {
      return {
        message: 'กรุณากรอกหมายเลขโทรศัพท์ให้ถูกต้อง',
      };
    }
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }

  private createTransaction(): void {
    this.transaction = {
      data: {
        transactionType: TransactionType.DEVICE_ORDER_PRE_TO_POST_AIS,
        action: TransactionAction.KEY_IN,
      }
    };
    delete this.transaction.data.customer;
  }

  homeHandler(): void {
    if (environment.name === 'LOCAL') {
      window.location.href = '/main-menu';
    } else {
      window.location.href = '/smart-digital/main-menu';
    }
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

}
