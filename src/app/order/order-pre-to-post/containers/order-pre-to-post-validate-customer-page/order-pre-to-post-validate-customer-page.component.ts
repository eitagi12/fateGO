import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, PageLoadingService, Utils, AlertService, TokenService, ChannelType } from 'mychannel-shared-libs';
import { Transaction, TransactionType, TransactionAction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import {
  ROUTE_ORDER_PRE_TO_POST_VALIDATE_CUSTOMER_ID_CARD_PAGE,
  ROUTE_ORDER_PRE_TO_POST_CURRENT_INFO_PAGE,
  ROUTE_ORDER_PRE_TO_POST_ELIGIBLE_MOBILE_PAGE
} from 'src/app/order/order-pre-to-post/constants/route-path.constant';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';

export enum ControlLED {
  EVENT_LED_ON = 'ControlLED|On',
  EVENT_LED_OFF = 'ControlLED|Off',
  EVENT_LED_BLINK = 'ControlLED|Blink',
}

export enum ControlSimCard {
  EVENT_CHECK_SIM_INVENTORY = 'GetSIMInventory',
  EVENT_CHECK_SIM_STATE = 'GetCardState',
  EVENT_CHECK_BIN_STATE = 'GetBinState',
  EVENT_LOAD_SIM = 'LoadSIM',
  EVENT_KEEP_SIM = 'KeepCard',
  EVENT_RELEASE_SIM = 'ReleaseSIM'
}

export enum SIMCardStatus {
  INVENTORY_1_HAVE_CARD = 'Card Stacker 1 is unknown status',
  INVENTORY_2_HAVE_CARD = 'Card Stacker 2 is unknown status',
  INVENTORY_1_LESS_CARD = 'Card Stacker 1 is less card',
  INVENTORY_2_LESS_CARD = 'Card Stacker 2 is less card',
  INVENTORY_1_EMPTY_CARD = 'Card Stacker 1 is empty',
  INVENTORY_2_EMPTY_CARD = 'Card Stacker 2 is empty',
  STATUS_IN_IC = 'Card in IC position',
  STATUS_NO_CARD = 'No card inside reader unit',
}

@Component({
  selector: 'app-order-pre-to-post-validate-customer-page',
  templateUrl: './order-pre-to-post-validate-customer-page.component.html',
  styleUrls: ['./order-pre-to-post-validate-customer-page.component.scss']
})
export class OrderPreToPostValidateCustomerPageComponent implements OnInit, OnDestroy {

  transaction: Transaction;

  identityValid: boolean = false;
  identity: string;
  ws: any;
  checkCardIntraval: any;

  constructor(
    private utils: Utils,
    private router: Router,
    private http: HttpClient,
    private homeService: HomeService,
    private alertService: AlertService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private tokenService: TokenService,
  ) {
    this.homeService.callback = () => {

      if (this.checkCardIntraval) {
        clearInterval(this.checkCardIntraval);
      }
      if (this.ws) {
        this.ws.send(ControlLED.EVENT_LED_OFF);
        this.ws.close();
      }
      window.location.href = '/smart-shop';

    };
  }

  ngOnInit(): void {
    this.createTransaction();

    if (this.tokenService.getUser().channelType === ChannelType.SMART_ORDER) {
      this.checkCardPresent();
    }
  }

  checkCardPresent(): void {
    this.ws = new WebSocket(`${environment.WEB_CONNECT_URL}/VendingAPI`);

    this.ws.onopen = () => {
      this.ws.send(ControlLED.EVENT_LED_BLINK);
      this.checkCardIntraval = setInterval(() => {
        this.ws.send(ControlSimCard.EVENT_CHECK_SIM_STATE);
      }, 800);
    };

    this.ws.onmessage = (evt) => {
      const resultOnmessage = JSON.parse(evt.data);
      if (resultOnmessage.Result !== SIMCardStatus.STATUS_NO_CARD && resultOnmessage.Result !== 'Success') {
        clearInterval(this.checkCardIntraval);
        this.ws.send(ControlLED.EVENT_LED_OFF);
        this.onReadCard();
      }
    };

  }

  onError(valid: boolean): void {
    this.identityValid = valid;
  }

  onCompleted(identity: string): void {
    this.identity = identity;
  }

  onReadCard(): void {
    this.router.navigate([ROUTE_ORDER_PRE_TO_POST_VALIDATE_CUSTOMER_ID_CARD_PAGE]);
  }

  onBack(): void {
    this.homeService.goToHome();
  }

  onHome(): void {
    this.homeService.goToHome();
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
        const historyOrder = (resp.data || []).find((order: any) => {
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
        if (historyOrder) {
          this.pageLoadingService.closeLoading();
          const createDate = moment(historyOrder.createDate, 'YYYYMMDD').format('DD/MM/YYYY');
          this.alertService.error(`ระบบไม่สามารถทำรายการได้ <br>หมายเลข ${this.identity}
          อยู่ระหว่างย้ายค่ายไปยังผู้ให้บริการรายอื่น (True, DTAC)(ทำรายการวันที่${createDate})`);
        } else {
          this.checkCustomerProfile();
        }
      }).catch(() => this.checkCustomerProfile());
  }

  checkCustomerProfile(): void {

    this.pageLoadingService.openLoading();

    if (this.utils.isMobileNo(this.identity)) {
      this.http.get('/api/customerportal/validate-customer-mobile-no-pre-to-post', {
        params: {
          mobileNo: this.identity
        }
      }).toPromise()
        .then((resp: any) => {
          this.transaction.data.simCard = { mobileNo: this.identity, persoSim: false };
          this.transaction.data.action = TransactionAction.KEY_IN_REPI;
          this.pageLoadingService.closeLoading();
          this.router.navigate([ROUTE_ORDER_PRE_TO_POST_CURRENT_INFO_PAGE]);
        })
        .catch((resp: any) => {
          this.alertService.error(resp.error.resultDescription);
        });
      return;
    }

    this.http.get('/api/customerportal/validate-customer-pre-to-post', {
      params: {
        identity: this.identity
      }
    }).toPromise()
      .then((resp: any) => {
        const data = resp.data || [];
        this.transaction.data.customer = data;
      })
      .then(() => { // load bill cycle
        return this.http.get(`/api/customerportal/newRegister/${this.identity}/queryBillingAccount`).toPromise()
          .then((resp: any) => {
            const data = resp.data || {};
            return this.http.post('/api/customerportal/verify/billingNetExtreme', {
              businessType: '1',
              listBillingAccount: data.billingAccountList
            }).toPromise()
              .then((respBillingNetExtreme: any) => {
                if (respBillingNetExtreme.data.length > 0) {
                  return {
                    billCycles: data.billingAccountList,
                    billCyclesNetExtreme: respBillingNetExtreme.data
                  };
                } else {
                  return {
                    billCycles: data.billingAccountList
                  };
                }
              })
              .catch(() => {
                return {
                  billCycles: data.billingAccountList
                };
              });
          });
      })
      .then((billingInformation: any) => {
        this.transaction.data.billingInformation = billingInformation;
        this.router.navigate([ROUTE_ORDER_PRE_TO_POST_ELIGIBLE_MOBILE_PAGE]);
      })
      .catch((resp: any) => {
        this.alertService.error(resp.error.resultDescription);
      })
      .then(() => {
        this.pageLoadingService.closeLoading();
      });
  }

  customerValidate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const length = control.value.length;

    if (this.utils.isMobileNo(value)) {
      return null;
    } else {
      return {
        message: 'กรุณากรอกหมายเลขโทรศัพท์ให้ถูกต้อง',
      };
    }
  }

  ngOnDestroy(): void {
    if (this.checkCardIntraval) {
      clearInterval(this.checkCardIntraval);
    }
    if (this.ws) {
      this.ws.send(ControlLED.EVENT_LED_OFF);
      this.ws.close();
    }

    this.transactionService.save(this.transaction);
  }

  private createTransaction(): void {
    this.transaction = {
      data: {
        transactionType: TransactionType.ORDER_PRE_TO_POST,
        action: TransactionAction.KEY_IN,
      }
    };
  }
}
