import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { MobileCare, ShoppingCart, HomeService, PageLoadingService, AlertService, MobileInfo } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { MobileCareService } from 'src/app/device-order/services/mobile-care.service';
// tslint:disable-next-line: max-line-length
// import { ROUTE_DEVICE_ORDER_AIS_MNP_PAYMENT_DETAIL_PAGE, ROUTE_DEVICE_ORDER_AIS_MNP_ELIGIBLE_MOBILE_PAGE } from '../../constants/route-path.constant';
import { HttpClient } from '@angular/common/http';
import { Profile } from 'selenium-webdriver/firefox';
import { TranslateService } from '@ngx-translate/core';
import { Subscribable, Subscription } from 'rxjs';
import { ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_ELIGIBLE_MOBILE_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-new-register-mnp-mobile-detail-page',
  templateUrl: './new-register-mnp-mobile-detail-page.component.html',
  styleUrls: ['./new-register-mnp-mobile-detail-page.component.scss']
})
export class NewRegisterMnpMobileDetailPageComponent implements OnInit, OnDestroy {
  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;
  priceOption: PriceOption;
  transaction: Transaction;
  shoppingCart: ShoppingCart;

  mcLoadingService: Promise<any>;

  mobileInfo: MobileInfo;
  translationSubscribe: Subscription;
  currentLang: string = 'TH';
  constructor(private router: Router,
    private homeService: HomeService,
    private priceOptionService: PriceOptionService,
    private transactionService: TransactionService,
    private pageLoadingService: PageLoadingService,
    private shoppingCartService: ShoppingCartService,
    private mobileCareService: MobileCareService,
    private alertService: AlertService,
    private http: HttpClient,
    private translationService: TranslateService) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();

    this.currentLang = this.translationService.currentLang || 'TH';
    this.translationSubscribe = this.translationService.onLangChange.subscribe(lang => {
      this.currentLang = typeof (lang) === 'object' ? lang.lang : lang;
      this.getMobileProfile();
    });
  }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    delete this.transaction.data.mobileCarePackage;
    this.getMobileProfile();
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_ELIGIBLE_MOBILE_PAGE]);
  }

  onNext(): void {
    // this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_PAYMENT_DETAIL_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onCompleted(mobileCare: any): void {
    this.transaction.data.mobileCarePackage = mobileCare;
  }

  ngOnDestroy(): void {
    if (this.translationSubscribe) {
      this.translationSubscribe.unsubscribe();
    }
    this.transactionService.update(this.transaction);
  }
  getMobileProfile(): void {
    this.pageLoadingService.openLoading();
    const idCardNo = this.transaction.data.customer.idCardNo;
    const mobileNoCurrent = this.transaction.data.simCard.mobileNo;

    this.http.get(`/api/customerportal/mobile-detail/${mobileNoCurrent}`).toPromise().then((response: any) => {
      const mobileDetail = response.data || {};
      const serviceYear = mobileDetail.serviceYear;
      this.mobileInfo = {
        mobileNo: mobileNoCurrent,
        chargeType: this.mapChargeType(mobileDetail.chargeType),
        status: mobileDetail.mobileStatus,
        sagment: mobileDetail.mobileSegment,
        serviceYear: this.serviceYearWording(serviceYear.year, serviceYear.month, serviceYear.day),
        mainPackage: this.changeMainPackageLangauge(mobileDetail.package)
      };

      this.transaction.data.simCard.chargeType = mobileDetail.chargeType;
      this.transaction.data.simCard.billingSystem = mobileDetail.billingSystem;
      this.transaction.data.currentPackage = mobileDetail.package;

      return this.http.get(`/api/customerportal/newRegister/${idCardNo}/queryBillingAccount`).toPromise();
    }).then((resp: any) => {
      this.pageLoadingService.closeLoading();
      const data = resp.data || {};
      const billingAccountList: any = [];
      const mobileNoList: any = [];
      data.billingAccountList.forEach(list => billingAccountList.push(list));
      billingAccountList.forEach(billings => mobileNoList.push(billings.mobileNo));

      let isAirtime: boolean = false;
      if (this.priceOption.trade) {
        const trade = this.priceOption.trade;
        isAirtime = trade.advancePay.amount > 0 ? true : false;
      }
      const billCycles = this.transaction.data.billingInformation.billCycles;
      const mobileBillAccount = billCycles.map(billcycle => billcycle.mobileNo).find((mobile) => {
        return mobile.includes(mobileNoCurrent);
      });

      this.transaction.data.billingInformation.isNewBAFlag = mobileBillAccount.length > 1 ? true : false;

      if (mobileBillAccount && mobileBillAccount.length > 1 && isAirtime) {
        this.alertService.warning(this.translationService.instant('หมายเลขนี้มีการรวมบิล ไม่สามารถทำรายการได้'))
          .then(() => {
            this.onBack();
          });
        return;
      }
    });
  }

  changeMainPackageLangauge(mobileDetail: any = {}): string {
    return this.isEngLanguage() ? mobileDetail.titleEng : mobileDetail.title;
  }

  mapChargeType(chargeType: string): any {
    if ('Post-paid' === chargeType) {
      return this.isEngLanguage() ? 'Postpaid' : 'รายเดือน';
    } else {
      return this.isEngLanguage() ? 'Prepaid' : 'เติมเงิน';
    }
  }

  isEngLanguage(): boolean {
    return this.translationService.currentLang === 'EN';
  }

  serviceYearWording(year: string, month: string, day: string): string {
    let serviceYearWording = '';
    if (year) {
      serviceYearWording = this.isEngLanguage() ? `${year || ''} year ` : `${year || ''} ปี `;
    }

    if (month) {
      serviceYearWording += this.isEngLanguage() ? `${month} month ` : `${month} เดือน `;
    }

    if (day) {
      serviceYearWording += this.isEngLanguage() ? `${day} day` : `${month} วัน`;
    }

    return serviceYearWording;
  }

}
