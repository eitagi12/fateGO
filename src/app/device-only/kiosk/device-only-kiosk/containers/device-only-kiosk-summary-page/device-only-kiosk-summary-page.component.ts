import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_DEVICE_ONLY_KIOSK_CHECKOUT_PAYMENT_PAGE, ROUTE_DEVICE_ONLY_KIOSK_SELECT_MOBILE_CARE_PAGE, ROUTE_DEVICE_ONLY_KIOSK_CHECKOUT_PAYMENT_QR_CODE_PAGE } from '../../constants/route-path.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { AlertService, HomeService, ShoppingCart, PageLoadingService } from 'mychannel-shared-libs';
import { HomeButtonService } from 'src/app/device-only/services/home-button.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { WIZARD_DEVICE_ONLY_AIS } from 'src/app/device-only/constants/wizard.constant';
import { SummarySellerCodeComponent } from 'src/app/device-only/components/summary-seller-code/summary-seller-code.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-device-only-kiosk-summary-page',
  templateUrl: './device-only-kiosk-summary-page.component.html',
  styleUrls: ['./device-only-kiosk-summary-page.component.scss']
})
export class DeviceOnlyKioskSummaryPageComponent implements OnInit {

  @ViewChild(SummarySellerCodeComponent) summarySellerCode: SummarySellerCodeComponent;

  wizards: string[] = WIZARD_DEVICE_ONLY_AIS;
  shoppingCart: ShoppingCart;
  priceOption: PriceOption;
  transaction: Transaction;
  isReasonNotBuyMobileCare: boolean;
  priceMobileCare: number;
  balance: number;
  enoughBalance: boolean;
  isShowBalance: boolean;
  isNext: boolean;

  constructor(
    private router: Router,
    private homeService: HomeService,
    public transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private homeButtonService: HomeButtonService,
    public alertService: AlertService,
    private http: HttpClient,
    private pageLoadingService: PageLoadingService
  ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.homeButtonService.initEventButtonHome();
    this.checkShowBalance();
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ONLY_KIOSK_SELECT_MOBILE_CARE_PAGE]);
  }

  onNext(): void {
    if (this.transaction.data.payment.paymentType === 'QR_CODE') {
      this.router.navigate([ROUTE_DEVICE_ONLY_KIOSK_CHECKOUT_PAYMENT_QR_CODE_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ONLY_KIOSK_CHECKOUT_PAYMENT_PAGE]);
    }
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  checkShowBalance(): void {
    if (this.transaction.data.mobileCarePackage.customAttributes && this.transaction.data.simCard.chargeType === 'Pre-paid') {
      this.getBalance();
    } else {
      this.isNext = true;
      this.isShowBalance = false;
    }
  }

  getBalance(): void {
    this.pageLoadingService.openLoading();
    const mobileNo = this.transaction.data.simCard.mobileNo;
    this.http.get(`/api/customerportal/newRegister/${mobileNo}/getBalance`).toPromise()
      .then((response: any) => {
        this.pageLoadingService.closeLoading();
        this.priceMobileCare = +this.transaction.data.mobileCarePackage.customAttributes.priceInclVat;
        this.balance = +(response.data.remainingBalance) / 100;
        this.enoughBalance = (this.balance >= this.priceMobileCare) ? true : false;
        this.isNext = this.enoughBalance;
        this.isShowBalance = true;
      });
  }

}
