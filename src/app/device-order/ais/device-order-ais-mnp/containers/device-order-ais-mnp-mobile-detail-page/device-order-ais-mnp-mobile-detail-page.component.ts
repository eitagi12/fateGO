import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { MobileCare, ShoppingCart, HomeService, PageLoadingService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { MobileCareService } from 'src/app/device-order/services/mobile-care.service';
import { ROUTE_DEVICE_ORDER_AIS_MNP_CONFIRM_USER_INFORMATION_PAGE, ROUTE_DEVICE_ORDER_AIS_MNP_SUMMARY_PAGE, ROUTE_DEVICE_ORDER_AIS_MNP_PAYMENT_DETAIL_PAGE, ROUTE_DEVICE_ORDER_AIS_MNP_ELIGIBLE_MOBILE_PAGE, ROUTE_DEVICE_ORDER_AIS_MNP_SELECT_NUMBER_PAGE, ROUTE_DEVICE_ORDER_AIS_MNP_SELECT_PACKAGE_PAGE } from '../../constants/route-path.constant';
import { HttpClient } from '@angular/common/http';
import { Profile } from 'selenium-webdriver/firefox';

export interface MobileNoUseTime {
  month: string;
  year: string;
}

@Component({
  selector: 'app-device-order-ais-mnp-mobile-detail-page',
  templateUrl: './device-order-ais-mnp-mobile-detail-page.component.html',
  styleUrls: ['./device-order-ais-mnp-mobile-detail-page.component.scss']
})
export class DeviceOrderAisMnpMobileDetailPageComponent implements OnInit , OnDestroy {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;

  priceOption: PriceOption;
  transaction: Transaction;
  mobileCare: MobileCare;
  shoppingCart: ShoppingCart;
  chargeType: string;
  mobileStatus: string;
  mobileNoCurrent: string;
  mainPackageMobileNo: any;
  mobileProfile: any;
  mobileYear: number;
  mobileMonth: number;
  greetingProfile: any;
  mobileNoUseTime: MobileNoUseTime;

  mcLoadingService: Promise<any>;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private priceOptionService: PriceOptionService,
    private transactionService: TransactionService,
    private pageLoadingService: PageLoadingService,
    private shoppingCartService: ShoppingCartService,
    private mobileCareService: MobileCareService,
    private http: HttpClient
  ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    delete this.transaction.data.mobileCarePackage;
    this.callService();
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_ELIGIBLE_MOBILE_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_SELECT_PACKAGE_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onCompleted(mobileCare: any): void {
    this.transaction.data.mobileCarePackage = mobileCare;
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  callService(): void {
    this.pageLoadingService.openLoading();
    const idCardNo = '1221003650348';
    this.http.get(`/api/customerportal/newRegister/${idCardNo}/queryBillingAccount`)
    .toPromise().then((resp: any) => {
      const data = resp.data || {};
      const billingAccountList: any = [];
      const mobileNoList: any = [];
      data.billingAccountList.forEach(list => billingAccountList.push(list));
      billingAccountList.forEach(billings => mobileNoList.push(billings.mobileNo));
      this.mobileNoCurrent = this.transaction.data.simCard.mobileNo;
      return  this.http.get(`/api/customerportal/greeting/${this.mobileNoCurrent}/profile`).toPromise();
    }).then((greetingProfile: any) => {
        this.greetingProfile = greetingProfile.data || {};
        return this.http.get(`/api/customerportal/asset/${this.mobileNoCurrent}/packages`).toPromise();
    }).then((packages: any) => {
      const packagesPorfile = packages.data.packages || [];
      this.mainPackageMobileNo = packagesPorfile.find((profile: any) => profile.isMainPackage || {});
      return this.http.get(`/api/customerportal/customerprofile/${this.mobileNoCurrent}`).toPromise();
    }).then((mobileProfile: any) => {
      this.mobileProfile = mobileProfile.data || {};
      this.getServiceYearMobileNoUse();
      this.pageLoadingService.closeLoading();
    });
  }

  getServiceYearMobileNoUse(): void {
    const date = this.greetingProfile.registerDate.split(' ');
    const dateConvert = date[0].split('/');
    const registerDate = new Date(dateConvert[2], dateConvert[1], dateConvert[0]);
    const date1 = new Date();
    date1.setDate(1);
    const regDate = dateConvert[1] + '/01/' + dateConvert[2];
    const date2 = new Date(regDate);
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24 * 30));
    // tslint:disable-next-line:radix
    const diffY: any =  parseInt((diffDays / 12) + '');
    // tslint:disable-next-line:radix
    const diffM: any =  parseInt((diffDays - (diffY * 12)) + '');
    this.mobileNoUseTime = { month:  diffM, year: diffY };
  }

}
