import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { ShoppingCart, HomeService, TokenService, PageLoadingService, IdCardPipe, AlertService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { DecimalPipe } from '@angular/common';
import { ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_AGREEMENT_SIGN_PAGE, ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_SUMMARY_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-gadget/constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-existing-gadget-econtract-page',
  templateUrl: './device-order-ais-existing-gadget-econtract-page.component.html',
  styleUrls: ['./device-order-ais-existing-gadget-econtract-page.component.scss']
})
export class DeviceOrderAisExistingGadgetEcontractPageComponent implements OnInit, OnDestroy {
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
    private idCardPipe: IdCardPipe,
    private decimalPipe: DecimalPipe,
    private alertService: AlertService
  ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();
    delete this.transaction.data.contract;
    this.homeService.callback = () => {
      this.alertService.question('ต้องการยกเลิกรายการขายหรือไม่ การยกเลิก ระบบจะคืนสินค้าเข้าสต๊อคสาขาทันที', 'ตกลง', 'ยกเลิก')
        .then((response: any) => {
          if (response.value === true) {
            this.returnStock().then(() => {
              window.location.href = '/';
            });
          }
        });
    };
  }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    this.callService();
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_SUMMARY_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_AGREEMENT_SIGN_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  callService(): void {
    this.pageLoadingService.openLoading();
    const user = this.tokenService.getUser();
    const campaign: any = this.priceOption.campaign || {};
    const trade: any = this.priceOption.trade || {};
    const productStock: any = this.priceOption.productStock || {};
    const customer: any = this.transaction.data.customer || {};
    const simCard: any = this.transaction.data.simCard || {};
    const mainPackage: any = this.transaction.data.mainPackage || {};
    const currentPackage: any = this.transaction.data.currentPackage || {};
    const advancePay: any = trade.advancePay || {};

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
          idCard: this.idCardPipe.transform(customer.idCardNo), // this.transformIDcard(customer.idCardNo),
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
          packageDetail: mainPackage.detailTH || currentPackage.detail,
          airTimeDiscount: this.getAirTimeDiscount(advancePay.amount, advancePay.promotions),
          airTimeMonth: this.getAirTimeMonth(advancePay.promotions),
          price: this.decimalPipe.transform(+trade.promotionPrice + (+advancePay.amount)),
          signature: '',
          mobileCarePackageTitle: '',
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
    if (!advancePayPromotions) {
      return 0;
    }

    if (Array.isArray(advancePayPromotions)) {
      return (advancePayPromotions.length > 0 ? (+amount / +(advancePayPromotions[0].month || 1)) : 0);
    } else {
      return (+amount / +(advancePayPromotions.month || 1)) || 0;
    }
  }

  getAirTimeMonth(advancePayPromotions: any): number {
    if (!advancePayPromotions) {
      return 0;
    }

    if (Array.isArray(advancePayPromotions) && advancePayPromotions.length > 0) {
      return advancePayPromotions[0].month || 0;
    }
    return 0;
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
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
