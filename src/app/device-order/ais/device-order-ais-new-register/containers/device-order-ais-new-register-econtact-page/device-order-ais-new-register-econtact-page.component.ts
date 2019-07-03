import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HomeService, ShoppingCart, PageLoadingService, TokenService, IdCardPipe, Utils } from 'mychannel-shared-libs';
import {
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_EAPPLICATION_PAGE,
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_SUMMARY_PAGE
} from 'src/app/device-order/ais/device-order-ais-new-register/constants/route-path.constant';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { DecimalPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { CreateEcontractService } from 'src/app/shared/services/create-econtract.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-device-order-ais-new-register-econtact-page',
  templateUrl: './device-order-ais-new-register-econtact-page.component.html',
  styleUrls: ['./device-order-ais-new-register-econtact-page.component.scss']
})
export class DeviceOrderAisNewRegisterEcontactPageComponent implements OnInit, OnDestroy {
  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;

  priceOption: PriceOption;
  transaction: Transaction;
  shoppingCart: ShoppingCart;
  eContactSrc: string;
  agreement: boolean;

  translateSubscription: Subscription;
  currentLang: string;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private http: HttpClient,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private tokenService: TokenService,
    private pageLoadingService: PageLoadingService,
    private shoppingCartService: ShoppingCartService,
    private idCardPipe: IdCardPipe,
    private decimalPipe: DecimalPipe,
    private createContractService: CreateEcontractService,
    private translationService: TranslateService
  ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();

    this.currentLang = this.translationService.currentLang || 'TH';
    this.translateSubscription = this.translationService.onLangChange.subscribe(lang => {
      this.currentLang = typeof (lang) === 'object' ? lang.lang : lang;
      this.callService();
    });
  }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    this.callService();
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_SUMMARY_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_EAPPLICATION_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  callService(): void {
    // http://10.137.16.46:8080/api/salesportal/promotion-shelves/promotion/condition
    const user = this.tokenService.getUser();
    const campaign: any = this.priceOption.campaign || {};
    const trade: any = this.priceOption.trade || {};
    this.pageLoadingService.openLoading();
    this.http.post('/api/salesportal/promotion-shelves/promotion/condition', {
      conditionCode: campaign.conditionCode,
      location: user.locationCode
    }).toPromise().then((resp: any) => {
      const condition = resp.data ? resp.data.data || {} : {};
      return this.createContractService.createEContractV2(this.transaction, this.priceOption, condition, this.currentLang)
      .then((eDocResp: any) => {
        return eDocResp.data || '';
      });
    })
      .then((eContact: string) => this.eContactSrc = eContact)
      .then(() => this.pageLoadingService.closeLoading());
  }

  ngOnDestroy(): void {
    if (this.translateSubscription) {
      this.translateSubscription.unsubscribe();
    }
    this.transactionService.update(this.transaction);
  }

}
