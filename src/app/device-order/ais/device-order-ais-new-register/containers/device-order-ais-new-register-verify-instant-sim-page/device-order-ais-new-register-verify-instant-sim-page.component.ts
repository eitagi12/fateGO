import { Component, OnInit, OnDestroy } from '@angular/core';
import { SimSerial, HomeService, AlertService, PageLoadingService, ShoppingCart, SimSerialComponent } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import {
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_SELECT_NUMBER_PAGE,
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_SELECT_PACKAGE_PAGE
} from 'src/app/device-order/ais/device-order-ais-new-register/constants/route-path.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-device-order-ais-new-register-verify-instant-sim-page',
  templateUrl: './device-order-ais-new-register-verify-instant-sim-page.component.html',
  styleUrls: ['./device-order-ais-new-register-verify-instant-sim-page.component.scss']
})
export class DeviceOrderAisNewRegisterVerifyInstantSimPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;

  transaction: Transaction;
  simSerial: SimSerial;
  simSerialValid: boolean;
  shoppingCart: ShoppingCart;
  mcSimSerial: SimSerialComponent;
  translationSubscribe: Subscription;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private pageLoadingService: PageLoadingService,
    private alertService: AlertService,
    private http: HttpClient,
    private shoppingCartService: ShoppingCartService,
    private translationService: TranslateService
  ) {
    this.transaction = this.transactionService.load();
    this.translationSubscribe = this.translationService.onLangChange.subscribe(lang => {
      this.mcSimSerial.focusInput();
    });

  }

  ngOnInit(): void {
    delete this.transaction.data.simCard;

    this.shoppingCart = Object.assign(this.shoppingCartService.getShoppingCartData(), {
      mobileNo: ''
    });
  }

  onCheckSimSerial(serial: string): void {
    let validateVerifyInstantSim;
    if (environment.name === 'LOCAL' && serial === '9999999999999') {
      validateVerifyInstantSim = Promise.resolve({
        data: {
          mobileNo: '0999999999'
        }
      });
    } else {
      validateVerifyInstantSim = this.http.get(`/api/customerportal/validate-verify-instant-sim?serialNo=${serial}`).toPromise();
    }

    this.pageLoadingService.openLoading();
    validateVerifyInstantSim.then((resp: any) => {
      const simSerial = resp.data || {};
      this.simSerialValid = true;
      this.simSerial = {
        mobileNo: simSerial.mobileNo,
        simSerial: serial
      };
      this.transaction.data.simCard = {
        mobileNo: this.simSerial.mobileNo,
        simSerial: this.simSerial.simSerial,
        persoSim: false
      };
      this.shoppingCart = Object.assign(this.shoppingCart, {
        mobileNo: simSerial.mobileNo
      });
      this.pageLoadingService.closeLoading();
    }).catch((resp: any) => {
      this.simSerialValid = false;
      this.simSerial = undefined;
      const error = resp.error || [];
      this.pageLoadingService.closeLoading();
      this.alertService.notify({
        type: 'error',
        html: this.translationService.instant(error.resultDescription.replace(/<br>/, ' '))
      });
    });
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_SELECT_NUMBER_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_SELECT_PACKAGE_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}
