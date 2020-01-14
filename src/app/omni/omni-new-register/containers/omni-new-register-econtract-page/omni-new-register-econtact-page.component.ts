import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HomeService, ShoppingCart, PageLoadingService, TokenService, IdCardPipe, Utils } from 'mychannel-shared-libs';
import {
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_EAPPLICATION_PAGE,
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_SUMMARY_PAGE
} from 'src/app/device-order/ais/device-order-ais-new-register/constants/route-path.constant';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { DecimalPipe } from '@angular/common';
import { Subscription } from 'rxjs';
// import { CreateEcontractService } from 'src/app/shared/services/create-econtract.service';
// import { TranslateService } from '@ngx-translate/core';
import { WIZARD_OMNI_NEW_REGISTER } from 'src/app/omni/constants/wizard.constant';
import { ROUTE_OMNI_NEW_REGISTER_SUMMARY_PAGE, ROUTE_OMNI_NEW_REGISTER_EAPPLICATION_PAGE } from '../../constants/route-path.constant';
import { CreateEcontractService } from 'src/app/omni/omni-shared/services/create-econtract.service';

@Component({
  selector: 'app-omni-new-register-econtact-page',
  templateUrl: './omni-new-register-econtact-page.component.html',
  styleUrls: ['./omni-new-register-econtact-page.component.scss']
})
export class OmniNewRegisterEcontactPageComponent implements OnInit, OnDestroy {
  wizards: string[] = WIZARD_OMNI_NEW_REGISTER;

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
    // private translationService: TranslateService
  ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();

    this.currentLang = 'TH';
    // this.translateSubscription = this.translationService.onLangChange.subscribe(lang => {
    //   this.currentLang = typeof (lang) === 'object' ? lang.lang : lang;
    // this.callService();
    // });
  }

  ngOnInit(): void {
    // this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    this.callService();
  }

  onBack(): void {
    this.router.navigate([ROUTE_OMNI_NEW_REGISTER_SUMMARY_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_OMNI_NEW_REGISTER_EAPPLICATION_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  callService(): void {
    // http://10.137.16.46:8080/api/salesportal/promotion-shelves/promotion/condition
    const user = '1100';
    const campaign: any = this.priceOption.campaign || {};
    const trade: any = this.priceOption.trade || {};
    this.pageLoadingService.openLoading();
    this.http.post('/api/salesportal/promotion-shelves/promotion/condition', {
      conditionCode: 'CONDITION_2',
      location: user
    }).toPromise().then((resp: any) => {
      const condition = resp.data ? resp.data.data || {} : {};
      return this.createContractService.createEContractV2(condition)
        .then((eDocResp: any) => {
          return eDocResp.data || '';
        });
    })
      .then((eContact: string) => this.eContactSrc = eContact)
      .then(() => this.pageLoadingService.closeLoading());
  }

  ngOnDestroy(): void {
    // if (this.translateSubscription) {
    //   this.translateSubscription.unsubscribe();
    // }
    // this.transactionService.update(this.transaction);
  }

}
