import { Component, OnInit, OnDestroy } from '@angular/core';
import { EligibleMobile, HomeService } from 'mychannel-shared-libs';
import { Transaction, BillingAccount } from 'src/app/shared/models/transaction.model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { EligibleMobileService } from 'src/app/device-order/services/eligible-mobile.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { ROUTE_DEVICE_ORDER_AIS_MNP_CUSTOMER_INFO_PAGE, ROUTE_DEVICE_ORDER_AIS_MNP_MOBILE_DETAIL_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-mnp-eligible-mobile-page',
  templateUrl: './device-order-ais-mnp-eligible-mobile-page.component.html',
  styleUrls: ['./device-order-ais-mnp-eligible-mobile-page.component.scss']
})
export class DeviceOrderAisMnpEligibleMobilePageComponent implements OnInit, OnDestroy {

  eligibleMobiles: Array<EligibleMobile>;
  selectMobileNo: EligibleMobile;
  transaction: Transaction;
  priceOption: PriceOption;
  billingAccountList: Array<BillingAccount>;
  billingNetExtremeList: Array<BillingAccount>;

  idCardNo: string;

  constructor(
    private router: Router,
    private transactionService: TransactionService,
    private homeService: HomeService,
    private priceOptionService: PriceOptionService,
    private eligibleMobileService: EligibleMobileService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
    if (this.transaction.data.customer) {
      this.idCardNo = this.transaction.data.customer.idCardNo;
      const ussdCode = this.priceOption.trade.ussdCode;
      this.eligibleMobileService.getMobileList(this.idCardNo, ussdCode, `POSTPAID`)
      .then(mobiles =>  this.eligibleMobiles = mobiles);
    } else {
      this.onBack();
    }
  }

  onComplete(eligibleMobile: EligibleMobile): void {
    this.selectMobileNo = eligibleMobile;
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_CUSTOMER_INFO_PAGE]);
  }

  onNext(): void {
    this.transaction.data.simCard = { mobileNo: this.selectMobileNo.mobileNo, persoSim: false };
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_MOBILE_DETAIL_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}
