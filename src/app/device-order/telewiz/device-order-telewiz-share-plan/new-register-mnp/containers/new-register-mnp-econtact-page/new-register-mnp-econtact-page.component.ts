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
import { ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_SUMMARY_PAGE, ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_AGREEMENT_SIGN_PAGE } from '../../constants/route-path.constant';
import { WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN_TELEWIZ } from 'src/app/device-order/constants/wizard.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { RemoveCartService } from '../../services/remove-cart.service';

@Component({
  selector: 'app-new-register-mnp-econtact-page',
  templateUrl: './new-register-mnp-econtact-page.component.html',
  styleUrls: ['./new-register-mnp-econtact-page.component.scss']
})
export class NewRegisterMnpEcontactPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN_TELEWIZ;

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
    private translationService: TranslateService,
    private idCardPipe: IdCardPipe,
    private decimalPipe: DecimalPipe,
    private removeCartService: RemoveCartService) {
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
    this.router.navigate([ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_SUMMARY_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_AGREEMENT_SIGN_PAGE]);
  }

  onHome(): void {
    this.removeCartService.backToReturnStock('/', this.transaction);
  }
  callService(): void {
    this.pageLoadingService.openLoading();
    const user = this.tokenService.getUser();
    const campaign: any = this.priceOption.campaign || {};
    const trade: any = this.priceOption.trade || {};
    const queryParams: any = this.priceOption.queryParams || {};
    const productStock: any = this.priceOption.productStock || {};
    const customer: any = this.transaction.data.customer || {};
    const simCard: any = this.transaction.data.simCard || {};
    const mainPackage: any = this.transaction.data.mainPackage || {};
    const currentPackage: any = this.transaction.data.currentPackage || {};
    const advancePay: any = trade.advancePay || {};
    const locationName: any =  this.transaction.data.seller.locationName;
    const mobileCare: any = this.transaction.data.mobileCarePackage || '';

    this.http.post('/api/salesportal/promotion-shelves/promotion/condition', {
      conditionCode: campaign.conditionCode,
      location: user.locationCode
    }).toPromise().then((resp: any) => {
      const condition = resp.data ? resp.data.data || {} : {};
      const params = {
        data: {
          campaignName: campaign.campaignName,
          locationName: locationName || '',
          customerType: '',
          idCard: this.idCardPipe.transform(customer.idCardNo), // this.transformIDcard(customer.idCardNo),
          fullName: `${customer.firstName || ''} ${customer.lastName || ''}`,
          mobileNumber: simCard.mobileNo,
          imei: simCard.imei || '',
          brand: queryParams.brand || '',
          model: queryParams.model || '',
          color: productStock.colorName || '',
          priceIncludeVat: this.decimalPipe.transform(trade.normalPrice),
          priceDiscount: this.decimalPipe.transform(trade.discount ? trade.discount.amount : 0),
          netPrice: this.decimalPipe.transform(trade.promotionPrice),
          advancePay: this.decimalPipe.transform(advancePay.amount),
          contract: trade.durationContract,
          packageDetail: mainPackage.detailTH || currentPackage.detail,
          airTimeDiscount: this.getAirTimeDiscount(advancePay.amount, advancePay.promotions),
          airTimeMonth: this.getAirTimeMonth(advancePay.promotions),
          price: this.decimalPipe.transform(+trade.promotionPrice + (+advancePay.amount)),
          signature: '',
          mobileCarePackageTitle: mobileCare.title ? mobileCare.title : '',
          condition: condition.conditionText
        },
        docType: 'ECONTRACT',
        location: user.locationCode
      };

      if (condition.conditionCode) {
        this.transaction.data.contract = {
          conditionCode: condition.conditionCode
        };
      }

      return this.http.post('/api/salesportal/generate-e-document', params).toPromise().then((eDocResp: any) => {
        return eDocResp.data || '';
      });

    }).then((eContact: string) => this.eContactSrc = eContact)
      .then(() => this.pageLoadingService.closeLoading());
  }

  getAirTimeDiscount(amount: number, advancePayPromotions: any): number {
    let resultAirTimeDiscount;
    if (!advancePayPromotions) {
      return 0;
    }
    if (Array.isArray(advancePayPromotions)) {
      resultAirTimeDiscount = (advancePayPromotions.length > 0 ? (+amount / +(advancePayPromotions[0].month || 1)) : 0);
      return resultAirTimeDiscount.toFixed(0);
    } else {
      resultAirTimeDiscount = (+amount / +(advancePayPromotions.month || 1)) || 0;
      return resultAirTimeDiscount.toFixed(0);
    }
  }

  getAirTimeMonth(advancePayPromotions: any): number {
    if (!advancePayPromotions) {
      return 0;
    }

    if (Array.isArray(advancePayPromotions)) {
      return advancePayPromotions.length > 0 ? advancePayPromotions[0].month : 0;
    } else {
      return advancePayPromotions.month || 0;
    }
  }

  ngOnDestroy(): void {
    if (this.translationSubcription) {
      this.translationSubcription.unsubscribe();
    }
    this.transactionService.update(this.transaction);
  }

}
