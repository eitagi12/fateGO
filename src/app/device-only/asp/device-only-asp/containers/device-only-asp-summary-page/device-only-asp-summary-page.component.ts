import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Seller, Transaction } from 'src/app/shared/models/transaction.model';
import { SummarySellerCodeComponent } from 'src/app/device-only/components/summary-seller-code/summary-seller-code.component';
import { AlertService, TokenService, User, HomeService } from 'mychannel-shared-libs';
import { SellerService } from 'src/app/device-only/services/seller.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Router } from '@angular/router';
import { ROUTE_DEVICE_ONLY_ASP_CHECKOUT_PAYMENT_QR_CODE_PAGE, ROUTE_DEVICE_ONLY_ASP_CHECKOUT_PAYMENT_PAGE, ROUTE_DEVICE_ONLY_ASP_SELECT_MOBILE_CARE_PAGE } from '../../constants/route-path.constant';
import { ShopCheckSeller } from 'src/app/device-only/models/shopCheckSeller.model';
import { HomeButtonService } from 'src/app/device-only/services/home-button.service';
import { HttpClient } from '@angular/common/http';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { WIZARD_DEVICE_ONLY_AIS } from 'src/app/device-only/constants/wizard.constant';

@Component({
  selector: 'app-device-only-asp-summary-page',
  templateUrl: './device-only-asp-summary-page.component.html',
  styleUrls: ['./device-only-asp-summary-page.component.scss']
})
export class DeviceOnlyAspSummaryPageComponent implements OnInit, OnDestroy {
  @ViewChild(SummarySellerCodeComponent) summarySellerCode: SummarySellerCodeComponent;
  public wizards: string[] = WIZARD_DEVICE_ONLY_AIS;
  public isNext: boolean;
  private transaction: Transaction;
  private priceOption: PriceOption;

  constructor(
    private router: Router,
    private http: HttpClient,
    private alertService: AlertService,
    private homeService: HomeService,
    private homeButtonService: HomeButtonService,
    private sellerService: SellerService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private tokenService: TokenService
  ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.homeButtonService.initEventButtonHome();
  }

  private checkSeller(seller: Seller): void {
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
        this.checkRoutePaymentType();
      } else {
        this.alertService.warning(shopCheckSeller.message);
      }
    })
    .catch(() => {
      this.alertService.warning('ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้');
    });
  }

  private checkRoutePaymentType(): void {
    // if (this.transaction.data.payment.paymentType === 'QR_CODE') {
    //   this.router.navigate([ROUTE_DEVICE_ONLY_ASP_CHECKOUT_PAYMENT_QR_CODE_PAGE]);
    // } else {
      this.router.navigate([ROUTE_DEVICE_ONLY_ASP_CHECKOUT_PAYMENT_PAGE]);
    // }
  }

  public conditionNext(canNext: boolean): void {
    this.isNext = canNext;
  }

  public onHome(): void {
    this.homeService.goToHome();
  }

  public onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ONLY_ASP_SELECT_MOBILE_CARE_PAGE]);
  }

  public onNext(): void {
    const tradeType = this.priceOption.trade.tradeNo;
    this.transaction.data.tradeType = ((tradeType === '0') || (tradeType === null)) ? 'EUP' : 'Hand Set';
    const seller: Seller = this.summarySellerCode.getSeller();
    this.checkSeller(seller);
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }

}
