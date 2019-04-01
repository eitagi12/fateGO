import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_DEVICE_ONLY_AIS_SELECT_MOBILE_CARE_PAGE, ROUTE_DEVICE_ONLY_AIS_CHECKOUT_PAYMENT_PAGE } from 'src/app/device-only/ais/device-only-ais/constants/route-path.constant';
import { WIZARD_DEVICE_ONLY_AIS } from '../../constants/wizard.constant';
import { HomeService, AlertService } from 'mychannel-shared-libs';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Transaction, Seller } from 'src/app/shared/models/transaction.model';
import { HomeButtonService } from '../../services/home-button.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { SellerService } from 'src/app/device-only/ais/device-only-ais/services/seller.service';
import { ShopCheckSeller } from 'src/app/device-only/ais/device-only-ais/models/shopCheckSeller.model';
import { SummarySellerCodeComponent } from 'src/app/device-only/ais/device-only-ais/components/summary-seller-code/summary-seller-code.component';

@Component({
  selector: 'app-device-only-ais-summary-page',
  templateUrl: './device-only-ais-summary-page.component.html',
  styleUrls: ['./device-only-ais-summary-page.component.scss']
})
export class DeviceOnlyAisSummaryPageComponent implements OnInit , OnDestroy {

  @ViewChild(SummarySellerCodeComponent) summarySellerCode: SummarySellerCodeComponent;

  wizards: string[] = WIZARD_DEVICE_ONLY_AIS;
  priceOption: PriceOption;
  transaction: Transaction;
  isReasonNotBuyMobileCare: boolean;
  // telNo: string;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private homeButtonService: HomeButtonService,
    private alertService: AlertService,
    private sellerService: SellerService
  ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.homeButtonService.initEventButtonHome();
    this.isReasonNotBuyMobileCare = this.transaction.data.reasonCode ? false : true;
  }

  checkSeller(seller: Seller): void {
    if (!seller.sellerNo) {
      this.alertService.warning('กรุณากรอกข้อมูลให้ถูกต้อง');
      return;
    }
    this.sellerService.checkSeller(seller.sellerNo)
    .then((shopCheckSeller: ShopCheckSeller) => {
      if (shopCheckSeller.condition) {
        if (!this.transaction.data.seller) {
          this.transaction.data.seller = {
            sellerNo: seller.sellerNo
          };
        } else {
        this.transaction.data.seller.sellerNo = seller.sellerNo;
        }
        this.router.navigate([ROUTE_DEVICE_ONLY_AIS_CHECKOUT_PAYMENT_PAGE]);
      } else {
        this.alertService.warning(shopCheckSeller.message);
      }
    })
    .catch(() => {
      this.alertService.warning('ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้');
    });
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
