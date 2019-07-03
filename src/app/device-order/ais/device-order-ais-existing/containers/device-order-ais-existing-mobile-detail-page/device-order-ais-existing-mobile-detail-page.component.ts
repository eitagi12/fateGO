import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, MobileInfo, ShoppingCart, PageLoadingService, AlertService } from 'mychannel-shared-libs';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import {
  ROUTE_DEVICE_ORDER_AIS_EXISTING_PAYMENT_DETAIL_PAGE,
  ROUTE_DEVICE_ORDER_AIS_EXISTING_ELIGIBLE_MOBILE_PAGE
} from '../../constants/route-path.constant';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction, BillingAccount } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-device-order-ais-existing-mobile-detail-page',
  templateUrl: './device-order-ais-existing-mobile-detail-page.component.html',
  styleUrls: ['./device-order-ais-existing-mobile-detail-page.component.scss']
})
export class DeviceOrderAisExistingMobileDetailPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;
  transaction: Transaction;
  mobileInfo: MobileInfo;
  shoppingCart: ShoppingCart;
  disableNextButton: boolean;
  priceOption: PriceOption;
  translateSubscription: Subscription;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private http: HttpClient,
    private alertService: AlertService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private shoppingCartService: ShoppingCartService,
    private priceOptionService: PriceOptionService,
    private translateService: TranslateService
  ) {
      this.priceOption = this.priceOptionService.load();
      this.transaction = this.transactionService.load();
   }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    this.callServices();
  }

  callServices(): void {
    this.pageLoadingService.openLoading();
    const idCardNo = this.transaction.data.customer.idCardNo;
    const mobileNo = this.transaction.data.simCard.mobileNo;

    this.http.get(`/api/customerportal/mobile-detail/${mobileNo}`).toPromise()
    .then(this.mappingMobileDetailAndCallQueryBillingAccountService(mobileNo, idCardNo))
    .then(this.mappingMobileBillAccountAndIsAirtimeAndCheckWarning(mobileNo))
    .catch(this.ErrorMessage());
  }

  ErrorMessage(): (reason: any) => void | PromiseLike<void> {
    return (err: any) => {
      this.handleErrorMessage(err);
    };
  }

  mappingMobileBillAccountAndIsAirtimeAndCheckWarning(mobileNo: string): (value: Object) => void | PromiseLike<void> {
    return (resp: any) => {
      this.pageLoadingService.closeLoading();
      const { mobileBillAccount, isAirtime }: {
        mobileBillAccount: string[];
        isAirtime: boolean;
      } = this.mappingMobileBillAccountAndIsAirtime(resp, mobileNo);

      this.transaction.data.billingInformation.isNewBAFlag = !!(mobileBillAccount.length > 1);
      this.checkWarningBillingAccountMessage(mobileBillAccount, isAirtime);
    };
  }

  mappingMobileDetailAndCallQueryBillingAccountService(mobileNo: string, idCardNo: string)
  : (value: Object) => Object | PromiseLike<Object> {
    return (response: any) => {
      this.mappingMobileDetail(response, mobileNo);
      return this.http.get(`/api/customerportal/newRegister/${idCardNo}/queryBillingAccount`).toPromise();
    };
  }

  mappingMobileDetail(response: any, mobileNo: string): void {
    const mobileDetail = response.data || {};
    const serviceYear = mobileDetail.serviceYear;

    this.mobileInfo = this.mappingMobileInfo(mobileNo, mobileDetail, serviceYear);
    this.transaction.data.simCard.chargeType = mobileDetail.chargeType;
    this.transaction.data.simCard.billingSystem = mobileDetail.billingSystem;
    this.transaction.data.currentPackage = mobileDetail.package;

    this.translateSubscription = this.translateService.onLangChange
    .subscribe(() => this.mobileInfo = this.mappingMobileInfo(mobileNo, mobileDetail, serviceYear));
  }

  mappingMobileInfo(mobileNo: string, mobileDetail: any, serviceYear: any): any {
    return {
      mobileNo: mobileNo,
      chargeType: this.mapChargeType(mobileDetail.chargeType),
      status: mobileDetail.mobileStatus,
      sagment: mobileDetail.mobileSegment,
      serviceYear: this.serviceYearWording(serviceYear.year, serviceYear.month, serviceYear.day),
      mainPackage: this.changeMainPackageLangauge(mobileDetail.package)
    };
  }

  changeMainPackageLangauge(mobileDetail: any = {}): string {
    return (this.translateService.currentLang === 'EN') ? mobileDetail.titleEng : mobileDetail.title;
  }

  handleErrorMessage(err: any): void {
    this.disableNextButton = true;
    this.pageLoadingService.closeLoading();
    const error = err.error || {};
    const developerMessage = (error.errors || {}).developerMessage;
    this.alertService.error((developerMessage && error.resultDescription)
      ? `${developerMessage} ${error.resultDescription}` : `ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้`);
  }

  mappingMobileBillAccountAndIsAirtime(resp: any, mobileNo: string): {
    mobileBillAccount: string[];
    isAirtime: boolean;
  } {
    const data = resp.data || {};
    const billingAccountList: any = [];
    const mobileNoList: any = [];

    data.billingAccountList.forEach((list: any) => billingAccountList.push(list));
    billingAccountList.forEach((billings: {mobileNo: any; }) => mobileNoList.push(billings.mobileNo));

    let isAirtime: boolean = false;
    if (this.priceOption.trade) {
      const trade = this.priceOption.trade;
      isAirtime = !!(trade.advancePay.amount > 0);
    }

    const billCycles = this.transaction.data.billingInformation.billCycles;
    const mobileBillAccount = this.mapBillingCyclesByMobileNo(billCycles, mobileNo);
    return { mobileBillAccount, isAirtime };
  }

  mapBillingCyclesByMobileNo(billCycles: BillingAccount[], mobileNo: string): string[] {
    return billCycles.map(billcycle => billcycle.mobileNo).find((mobile) => mobile.includes(mobileNo));
  }

  checkWarningBillingAccountMessage(mobileBillAccount: string[], isAirtime: boolean): void {
    if (mobileBillAccount && mobileBillAccount.length > 1 && isAirtime) {
      this.alertService.warning(this.translateService.instant('หมายเลขนี้มีการรวมบิล ไม่สามารถทำรายการได้'))
      .then(() => this.onBack());
    }
  }

  mapChargeType(chargeType: string): any {
    if ('Post-paid' === chargeType) {
      return this.isEngLanguage() ? 'Postpaid' : 'รายเดือน';
    } else {
      return this.isEngLanguage() ? 'Prepaid' : 'เติมเงิน';
    }
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

  isEngLanguage(): boolean {
    return this.translateService.currentLang === 'EN';
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_ELIGIBLE_MOBILE_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_PAYMENT_DETAIL_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    if (this.translateSubscription) {
      this.translateSubscription.unsubscribe();
    }
    this.transactionService.update(this.transaction);
  }

}
