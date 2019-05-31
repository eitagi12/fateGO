import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_DEVICE_ONLY_AIS_SELECT_MOBILE_CARE_PAGE, ROUTE_DEVICE_ONLY_AIS_CHECKOUT_PAYMENT_PAGE, ROUTE_DEVICE_ONLY_AIS_CHECKOUT_PAYMENT_QR_CODE_PAGE } from 'src/app/device-only/ais/device-only-ais/constants/route-path.constant';
import { HomeService, AlertService, TokenService, ShoppingCart } from 'mychannel-shared-libs';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Transaction, Seller } from 'src/app/shared/models/transaction.model';

import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ShopCheckSeller } from 'src/app/device-only/ais/device-only-ais/models/shopCheckSeller.model';
import { SummarySellerCodeComponent } from 'src/app/device-only/components/summary-seller-code/summary-seller-code.component';
import { WIZARD_DEVICE_ONLY_AIS } from 'src/app/device-only/constants/wizard.constant';
import { HomeButtonService } from 'src/app/device-only/services/home-button.service';
import { SellerService } from 'src/app/device-only/services/seller.service';

@Component({
  selector: 'app-device-only-ais-summary-page',
  templateUrl: './device-only-ais-summary-page.component.html',
  styleUrls: ['./device-only-ais-summary-page.component.scss']
})
export class DeviceOnlyAisSummaryPageComponent implements OnInit , OnDestroy {

  @ViewChild(SummarySellerCodeComponent) summarySellerCode: SummarySellerCodeComponent;

  wizards: string[] = WIZARD_DEVICE_ONLY_AIS;
  shoppingCart: ShoppingCart;
  priceOption: PriceOption;
  transaction: Transaction;
  isReasonNotBuyMobileCare: boolean;
  isNext: boolean;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private homeButtonService: HomeButtonService,
    private alertService: AlertService,
    private sellerService: SellerService,
    private tokenService: TokenService
  ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.homeButtonService.initEventButtonHome();
  }

  checkSeller(seller: Seller): void {
    if (!seller.sellerNo) {
      this.alertService.warning('กรุณากรอกข้อมูลให้ถูกต้อง');
      return;
    }
    this.sellerService.checkSeller(seller.sellerNo).then((shopCheckSeller: ShopCheckSeller) => {
      if (shopCheckSeller.condition) {
        if (!this.transaction.data.seller) {
          this.transaction.data.seller = {
            sellerNo: seller.sellerNo,
            locationCode: this.tokenService.getUser().locationCode
          };
        } else {
        this.transaction.data.seller.sellerNo = seller.sellerNo;
        }
        if (this.transaction.data.payment.paymentType === 'QR_CODE') {
          this.router.navigate([ROUTE_DEVICE_ONLY_AIS_CHECKOUT_PAYMENT_QR_CODE_PAGE]);
        } else {
          this.router.navigate([ROUTE_DEVICE_ONLY_AIS_CHECKOUT_PAYMENT_PAGE]);
        }
      } else {
        this.alertService.warning(shopCheckSeller.message);
      }
    })
    .catch(() => {
      this.alertService.warning('ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้');
    });
  }

  conditionNext(canNext: boolean): void {
    this.isNext = canNext;
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ONLY_AIS_SELECT_MOBILE_CARE_PAGE]);
  }

  onNext(): void {
    const seller: Seller = this.summarySellerCode.getSeller();
    this.checkSeller(seller);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }
}
