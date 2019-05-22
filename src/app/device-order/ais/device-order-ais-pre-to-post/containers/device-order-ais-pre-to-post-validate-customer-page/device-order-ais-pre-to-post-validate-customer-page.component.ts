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
    private privilegeService: PrivilegeService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
  ) {
    this.user = this.tokenService.getUser();
    this.priceOption = this.priceOptionService.load();

    this.homeService.callback = () => {

      this.alertService.question('ต้องการยกเลิกรายการขายหรือไม่<br>การยกเลิกระบบจะคืนสินค้าเข้าสต๊อคสาขาทันที')
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
    this.returnStock().then(() => {
      this.router.navigate([ROUTE_BUY_PRODUCT_CAMPAIGN_PAGE], { queryParams: this.priceOption.queryParams });
    });
  }

  onNext(): void {
    this.pageLoadingService.openLoading();

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
            this.pageLoadingService.closeLoading();

          }).then(() => this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_CURRENT_INFO_PAGE]));

        })
        .catch((resp: any) => {
          this.alertService.error(resp.error.developerMessage);
        });
      return;
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
        if (transaction.data.simCard && transaction.data.simCard.mobileNo) {
          const unlockMobile = this.http.post('/api/customerportal/newRegister/selectMobileNumberRandom', {
            userId: this.user.username,
            mobileNo: transaction.data.simCard.mobileNo,
            action: 'Unlock'
          }).toPromise().catch(() => Promise.resolve());
          promiseAll.push(unlockMobile);
        }
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