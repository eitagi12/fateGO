import { Component, OnInit } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { EligibleMobile, HomeService } from 'mychannel-shared-libs';
import { Transaction, TransactionAction } from 'src/app/shared/models/transaction.model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import {
  ROUTE_DEVICE_ORDER_AIS_EXISTING_CUSTOMER_INFO_PAGE,
  ROUTE_DEVICE_ORDER_AIS_EXISTING_CHANGE_PACKAGE_PAGE
} from '../../constants/route-path.constant';
import { MobileListService } from 'src/app/device-order/services/mobile-list.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';

export interface BillingAccount {
  billingName: string;
  mobileNo: string[];
  billCycleFrom: string;
  billCycleTo: string;
  payDate: string;
  billingAddr: string;
  billAcctNo: string;
  bill: string;
  productPkg: string;
  billMedia: string;
}

@Component({
  selector: 'app-device-order-ais-existing-eligible-mobile-page',
  templateUrl: './device-order-ais-existing-eligible-mobile-page.component.html',
  styleUrls: ['./device-order-ais-existing-eligible-mobile-page.component.scss']
})
export class DeviceOrderAisExistingEligibleMobilePageComponent implements OnInit {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;
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
    private mobileListService: MobileListService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
    if (this.transaction.data.customer) {
      this.idCardNo = this.transaction.data.customer.idCardNo;
      const ussdCode = this.priceOption.trade.ussdCode;
      this.mobileListService.getMobileList(this.idCardNo, ussdCode, `POSTPAID`)
      .then(mobiles =>  this.eligibleMobiles = mobiles);
    } else {
      this.onBack();
    }
  }

  onComplete(eligibleMobile: EligibleMobile): void {
    this.selectMobileNo = eligibleMobile;
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_CUSTOMER_INFO_PAGE]);
  }

  onNext(): void {
    this.transaction.data.simCard = { mobileNo: this.selectMobileNo.mobileNo, persoSim: false };
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_CHANGE_PACKAGE_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

// tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}
