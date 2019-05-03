import { Component, OnInit } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { ShoppingCart, HomeService, TokenService, PageLoadingService, IdCardPipe, Utils } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { ROUTE_DEVICE_ORDER_AIS_MNP_SUMMARY_PAGE, ROUTE_DEVICE_ORDER_AIS_MNP_AGREEMENT_SIGN_PAGE } from '../../constants/route-path.constant';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-device-order-ais-mnp-econtact-page',
  templateUrl: './device-order-ais-mnp-econtact-page.component.html',
  styleUrls: ['./device-order-ais-mnp-econtact-page.component.scss'],
  providers: [IdCardPipe, DecimalPipe]
})
export class DeviceOrderAisMnpEcontactPageComponent implements OnInit {
  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;

  priceOption: PriceOption;
  transaction: Transaction;
  shoppingCart: ShoppingCart;
  eContactSrc: string;
  agreement: boolean;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private http: HttpClient,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private tokenService: TokenService,
    private pageLoadingService: PageLoadingService,
    private shoppingCartService: ShoppingCartService,
    private decimalPipe: DecimalPipe,
    private idCardPipe: IdCardPipe,
    private utils: Utils
  ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    this.callService();
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_SUMMARY_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_AGREEMENT_SIGN_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  callService(): void {
    // http://10.137.16.46:8080/api/salesportal/promotion-shelves/promotion/condition
    const user = this.tokenService.getUser();
    const campaign: any = this.priceOption.campaign || {};
    const trade: any = this.priceOption.trade || {};
    const productStock: any = this.priceOption.productStock || {};
    const customer: any = this.transaction.data.customer || {};
    const simCard: any = this.transaction.data.simCard || {};
    const mainPackage: any = this.transaction.data.mainPackage || {};
    const mobileCarePackage: any = this.transaction.data.mobileCarePackage || {};

    const advancePay: any = trade.advancePay || {};
    this.pageLoadingService.openLoading();
    this.http.post('/api/salesportal/promotion-shelves/promotion/condition', {
      conditionCode: campaign.conditionCode,
      location: user.locationCode
    }).toPromise().then((resp: any) => {
      const condition = resp.data ? resp.data.data || {} : {};
      const params = {
        data: {
          campaignName: campaign.campaignName,
          locationName: productStock.locationName || '',
          customerType: '',
          idCard: this.idCardPipe.transform(customer.idCardNo),
          fullName: `${customer.firstName || ''} ${customer.lastName || ''}`,
          mobileNumber: simCard.mobileNo,
          imei: simCard.imei || '',
          brand: productStock.brand,
          model: productStock.model,
          color: productStock.color,
          priceIncludeVat: this.decimalPipe.transform(trade.normalPrice),
          priceDiscount: this.decimalPipe.transform(trade.discount ? trade.discount.amount : 0),
          netPrice: this.decimalPipe.transform(trade.promotionPrice),
          advancePay: this.decimalPipe.transform(advancePay.amount),
          contract: trade.durationContract,
          packageDetail: mainPackage.detailTH,
          airTimeDiscount: this.getAirTimeDiscount(advancePay.amount, advancePay.promotions),
          airTimeMonth: this.getAirTimeMonth(advancePay.promotions),
          price: this.decimalPipe.transform(+trade.promotionPrice + (+advancePay.amount)),
          signature: '',
          mobileCarePackageTitle: mobileCarePackage.detailTH ? `พร้อมใช้บริการ ${mobileCarePackage.detailTH}` : '',
          condition: condition.conditionText,

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
    })
      .then((eContact: string) => this.eContactSrc = eContact)
      .then(() => this.pageLoadingService.closeLoading());
  }

  getAirTimeDiscount(amount: number, advancePayPromotions: any): number {
    if (!advancePayPromotions) {
      return 0;
    }

    if (Array.isArray(advancePayPromotions)) {
      return advancePayPromotions.length > 0 ? amount / advancePayPromotions[0] : 0;
    } else {
      return amount / advancePayPromotions;
    }
  }

  getAirTimeMonth(advancePayPromotions: any): number {
    if (!advancePayPromotions) {
      return 0;
    }

    if (Array.isArray(advancePayPromotions) && advancePayPromotions.length > 0) {
      return advancePayPromotions[0].month;
    }
    return 0;
  }

}
