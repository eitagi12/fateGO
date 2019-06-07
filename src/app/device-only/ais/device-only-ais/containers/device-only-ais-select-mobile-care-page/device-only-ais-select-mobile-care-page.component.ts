import { Component, OnInit, OnDestroy } from '@angular/core';
import { ROUTE_DEVICE_ONLY_AIS_SELECT_PAYMENT_AND_RECEIPT_INFORMATION_PAGE, ROUTE_DEVICE_ONLY_AIS_SUMMARY_PAGE } from '../../constants/route-path.constant';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { HomeService, ShoppingCart } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { WIZARD_DEVICE_ONLY_AIS } from 'src/app/device-only/constants/wizard.constant';
import { MobileCare } from '../../../../components/mobile-care/mobile-care.component';
import { HomeButtonService } from 'src/app/device-only/services/home-button.service';
@Component({
  selector: 'app-device-only-ais-select-mobile-care-page',
  templateUrl: './device-only-ais-select-mobile-care-page.component.html',
  styleUrls: ['./device-only-ais-select-mobile-care-page.component.scss']
})

export class DeviceOnlyAisSelectMobileCarePageComponent implements OnInit, OnDestroy {
  wizards: string[] = WIZARD_DEVICE_ONLY_AIS;
  transaction: Transaction;
  priceOption: PriceOption;
  shoppingCart: ShoppingCart;
  mobileCare: MobileCare;
  isVerifyflag: boolean;
  existingMobileCare: any;
  public isBuyMobileCare: boolean = false;
  public isReasonNotBuyMobileCare: string;
  isVerifyButtonNext: boolean;

  constructor(
    private router: Router,
    private homeService: HomeService,
    public transactionService: TransactionService,
    private homeButtonService: HomeButtonService,
    private priceOptionSevice: PriceOptionService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionSevice.load();
  }

  ngOnInit(): void {
    this.homeButtonService.initEventButtonHome();
  }

  public onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ONLY_AIS_SELECT_PAYMENT_AND_RECEIPT_INFORMATION_PAGE]);
  }

  public isVerifyNext(): boolean {
    if (this.isVerifyflag && this.transaction.data.mobileCarePackage) {
      return true;
    } else if (typeof(this.transaction.data.mobileCarePackage) === 'string') {
      return true;
    }
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
  public onHome(): void {
    this.homeService.goToHome();
  }

  public onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ONLY_AIS_SUMMARY_PAGE]);
  }

  onPromotion(mobileCare: any): void {
    this.transaction.data.mobileCarePackage = mobileCare;
  }
  onIsVerify(isVerifyflag: any): void {
    this.isVerifyflag = isVerifyflag;
  }

  onCompleted(mobileCare: any): void {
    this.transaction.data.mobileCarePackage = mobileCare;
    // this.transaction.data.simCard.mobileNo = mobileCare;
  }

  onMobile(mobileNo: any): void {
    this.transaction.data.simCard = mobileNo;
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}
