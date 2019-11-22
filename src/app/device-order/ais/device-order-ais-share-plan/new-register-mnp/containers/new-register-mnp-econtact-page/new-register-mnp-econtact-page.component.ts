import { Component, OnInit, OnDestroy } from '@angular/core';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { ShoppingCart, HomeService, TokenService, PageLoadingService, IdCardPipe, Utils } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
// tslint:disable-next-line: max-line-length
// import { ROUTE_DEVICE_ORDER_AIS_MNP_SUMMARY_PAGE, ROUTE_DEVICE_ORDER_AIS_MNP_AGREEMENT_SIGN_PAGE } from '../../constants/route-path.constant';
import { DecimalPipe } from '@angular/common';
import { CreateEcontractService } from 'src/app/shared/services/create-econtract.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_SUMMARY_PAGE, ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_AGREEMENT_SIGN_PAGE } from '../../constants/route-path.constant';
import { WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN } from 'src/app/device-order/constants/wizard.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';

@Component({
  selector: 'app-new-register-mnp-econtact-page',
  templateUrl: './new-register-mnp-econtact-page.component.html',
  styleUrls: ['./new-register-mnp-econtact-page.component.scss'],
  providers: [IdCardPipe, DecimalPipe]
})
export class NewRegisterMnpEcontactPageComponent implements OnInit, OnDestroy {
  wizards: string[] = WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN;

  priceOption: PriceOption;
  transaction: Transaction;
  shoppingCart: ShoppingCart;
  eContactSrc: string;
  agreement: boolean;

  translationSubcription: Subscription;
  currentLang: string;
  constructor(private router: Router,
    private homeService: HomeService,
    private http: HttpClient,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private tokenService: TokenService,
    private pageLoadingService: PageLoadingService,
    private shoppingCartService: ShoppingCartService,
    private createContractService: CreateEcontractService,
    private translationService: TranslateService) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();
    this.currentLang = this.translationService.currentLang || 'TH';
    this.translationSubcription = this.translationService.onLangChange.subscribe(lang => {
      this.currentLang = typeof (lang) === 'object' ? lang.lang : lang;
      this.callService();
    });
  }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartDataSuperKhum();
    this.callService();
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_SUMMARY_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_AGREEMENT_SIGN_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }
  callService(): void {
    const user = this.tokenService.getUser();
    const campaign: any = this.priceOption.campaign || {};
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
    if (this.translationSubcription) {
      this.translationSubcription.unsubscribe();
    }
    this.transactionService.update(this.transaction);
  }
}
