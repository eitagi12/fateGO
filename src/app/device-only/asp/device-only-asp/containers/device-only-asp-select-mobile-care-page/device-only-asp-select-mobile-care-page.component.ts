import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_DEVICE_ONLY_AIS } from 'src/app/device-only/constants/wizard.constant';
import { ShoppingCart, HomeService } from 'mychannel-shared-libs';
import { MobileCare } from 'src/app/device-only/components/mobile-care/mobile-care.component';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { Router } from '@angular/router';
import { ROUTE_DEVICE_ONLY_ASP_SUMMARY_PAGE, ROUTE_DEVICE_ONLY_ASP_SELECT_PAYMENT_AND_RECEIPT_INFORMATION_PAGE, ROUTE_DEVICE_ONLY_ASP_READ_CARD_PAGE } from '../../constants/route-path.constant';
import { HomeButtonService } from 'src/app/device-only/services/home-button.service';
import { HttpClient } from '@angular/common/http';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';

@Component({
  selector: 'app-device-only-asp-select-mobile-care-page',
  templateUrl: './device-only-asp-select-mobile-care-page.component.html',
  styleUrls: ['./device-only-asp-select-mobile-care-page.component.scss']
})
export class DeviceOnlyAspSelectMobileCarePageComponent implements OnInit, OnDestroy {
  public wizards: string[] = WIZARD_DEVICE_ONLY_AIS;
  private shoppingCart: ShoppingCart;
  public mobileCare: MobileCare;
  private transaction: Transaction;
  public priceOption: PriceOption;
  private isVerifyflag: boolean;

  constructor(
    private router: Router,
    private http: HttpClient,
    private homeService: HomeService,
    private homeButtonService: HomeButtonService,
    private transactionService: TransactionService,
    private priceOptionSevice: PriceOptionService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionSevice.load();
  }

  ngOnInit(): void {
    this.homeButtonService.initEventButtonHome();
  }

  public getCurrentPackMobileCare(existingMobileCare: any): void {
    if (existingMobileCare) {
      const existingObj = { ...existingMobileCare };
      if (!this.transaction.data.existingMobileCare) {
        this.transaction.data.existingMobileCare = existingObj;
        return;
      }
      this.transaction.data.existingMobileCare = existingObj;
    }
  }

  public onPromotion(mobileCare: any): void {
    this.transaction.data.mobileCarePackage = mobileCare;
  }

  public onIsVerify(isVerifyflag: any): void {
    this.isVerifyflag = isVerifyflag;
  }

  public onCompleted(mobileCare: any): void {
    this.transaction.data.mobileCarePackage = mobileCare;
  }

  public onMobile(mobileNo: any): void {
    this.transaction.data.simCard = mobileNo;
  }

  public isVerifyNext(): boolean {
    if (this.isVerifyflag && this.transaction.data.mobileCarePackage) {
      return true;
    } else if (typeof(this.transaction.data.mobileCarePackage) === 'string') {
      return true;
    }
  }

  public onHome(): void {
    this.homeService.goToHome();
  }

  public onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ONLY_ASP_READ_CARD_PAGE]);
  }

  public onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ONLY_ASP_SUMMARY_PAGE]);
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}
