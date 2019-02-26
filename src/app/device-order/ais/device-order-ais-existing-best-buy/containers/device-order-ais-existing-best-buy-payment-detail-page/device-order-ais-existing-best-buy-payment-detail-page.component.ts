import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { ApiRequestService, PageLoadingService, HomeService, ShoppingCart } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_DETAIL_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_CARE_AVAILABLE_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_CARE_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/constants/route-path.constant';
import { Transaction, ExistingMobileCare } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { ReceiptInfo } from 'mychannel-shared-libs/lib/component/receipt-info/receipt-info.component';
import { ShoppingCartService } from 'src/app/device-order/service/shopping-cart.service';

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

  receiptInfo: ReceiptInfo = {
    taxId: '',
    branch: '',
    buyer: '',
    buyerAddress: '',
    telNo: ''
  };

  grandTotal: String;
  productDetail: String;
  priceOptionPrivilegeTrade: String;
  constructor(
    private router: Router,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private apiRequestService: ApiRequestService,
    private http: HttpClient,
    private shoppingCartService: ShoppingCartService
  ) {
    this.transaction = this.transactionService.load();
   }

  ngOnInit() {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    console.log(this.shoppingCart);
    this.grandTotal = '44000';
    this.productDetail = 'APPLE iPhone X 256GB สี SPACE GREY ';
    this.priceOptionPrivilegeTrade = '1070 ';
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
}
