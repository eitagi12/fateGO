import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { ApiRequestService, PageLoadingService, HomeService, ShoppingCart, PaymentDetail, SelectPaymentDetail, PaymentDetailOption } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_DETAIL_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_CARE_AVAILABLE_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_CARE_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/constants/route-path.constant';
import { Transaction, ExistingMobileCare } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { ReceiptInfo } from 'mychannel-shared-libs/lib/component/receipt-info/receipt-info.component';
import { ShoppingCartService } from 'src/app/device-order/service/shopping-cart.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-payment-detail-page',
  templateUrl: './device-order-ais-existing-best-buy-payment-detail-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-payment-detail-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyPaymentDetailPageComponent implements OnInit, OnDestroy {

  wizards = WIZARD_DEVICE_ORDER_AIS;

  identityValid = true;
  transaction: Transaction;
  shoppingCart: ShoppingCart;
  priceOption: PriceOption;
  paymentDetail: PaymentDetail;
  selectPaymentDetail: SelectPaymentDetail;
  option: PaymentDetailOption;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private apiRequestService: ApiRequestService,
    private http: HttpClient,
    private shoppingCartService: ShoppingCartService,
    private priceOptionService: PriceOptionService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
   }

  ngOnInit() {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    setPamentDetail();
  }

  onHome() {
    this.homeService.goToHome();
  }

  onBack() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_DETAIL_PAGE]);
  }

  onNext() {
    const mobileNo = this.transaction.data.simCard.mobileNo;
    this.http.get(`/api/customerportal/get-existing-mobile-care/${mobileNo}`).toPromise().then((response: any) => {
      const exMobileCare = response.data;
      if (exMobileCare.hasExistingMobileCare) {
        const existingMobileCare: ExistingMobileCare = exMobileCare.existMobileCarePackage;
        existingMobileCare.handSet = exMobileCare.existHandSet;
        this.transaction.data.existingMobileCare = existingMobileCare;
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_CARE_AVAILABLE_PAGE]);
      } else {
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_CARE_PAGE]);
      }
    });
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  setPamentDetail() {
    // this.paymentDetail = {
    //   title?: string;
    //   header?: string;
    //   price?: string;
    //   headerAdvancePay?: string;
    //   priceAdvancePay?: string;
    //   specialAmountPercent?: string;
    //   specialAmountBaht?: string;
    //   qrCodes?: PaymentDetailQRCode[];
    //   banks?: PaymentDetailBank[];
    //   installments?: PaymentDetailInstallment[];
    // }
  }
}
