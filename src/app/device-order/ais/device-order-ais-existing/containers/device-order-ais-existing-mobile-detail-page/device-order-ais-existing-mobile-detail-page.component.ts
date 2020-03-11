import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, MobileInfo, ShoppingCart, PageLoadingService, AlertService, User, TokenService } from 'mychannel-shared-libs';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import {
  ROUTE_DEVICE_ORDER_AIS_EXISTING_PAYMENT_DETAIL_PAGE,
  ROUTE_DEVICE_ORDER_AIS_EXISTING_ELIGIBLE_MOBILE_PAGE
} from '../../constants/route-path.constant';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction, BillingAccount, HandsetSim5G } from 'src/app/shared/models/transaction.model';
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
  priceOption: PriceOption;
  transaction: Transaction;
  user: User;

  mobileInfo: MobileInfo;
  shoppingCart: ShoppingCart;
  disableNextButton: boolean;
  translateSubscription: Subscription;

  message5G: string;
  messageVolTE: string;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private http: HttpClient,
    private alertService: AlertService,
    private tokenService: TokenService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private shoppingCartService: ShoppingCartService,
    private priceOptionService: PriceOptionService,
    private translateService: TranslateService
  ) {
    this.user = this.tokenService.getUser();
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
      .then(this.getHandSetSim5G())
      .then(() => this.pageLoadingService.closeLoading())
      .catch(this.ErrorMessage());
  }

  ErrorMessage(): (reason: any) => void | PromiseLike<void> {
    return (err: any) => {
      this.handleErrorMessage(err);
    };
  }

  mappingMobileBillAccountAndIsAirtimeAndCheckWarning(mobileNo: string): (value: Object) => void | PromiseLike<void> {
    return (resp: any) => {
      const { mobileBillAccount, isAirtime }: {
        mobileBillAccount: string[];
        isAirtime: boolean;
      } = this.mappingMobileBillAccountAndIsAirtime(resp, mobileNo);

      this.transaction.data.billingInformation.isNewBAFlag = !!(mobileBillAccount.length > 1) && isAirtime;
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
    billingAccountList.forEach((billings: { mobileNo: any; }) => mobileNoList.push(billings.mobileNo));

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

  getHandSetSim5G(): (value: void) => void | PromiseLike<void> {
    return (response: any) => {
      const mobileNo = this.transaction.data.simCard.mobileNo;

      return this.http.post('/api/easyapp/configMC', {
        operation: 'query',
        nameconfig: 'showFlow5G'
      }).toPromise()
        .then((repConFig: any) => {

          const dataConfig: any = repConFig.data || {};
          if (dataConfig[0] &&
            dataConfig[0].config &&
            dataConfig[0].config.data[0] &&
            dataConfig[0].config.data[0].status) {

            const queryParams = this.priceOption.queryParams || {};
            const brand: string = queryParams.brand.replace(/\(/g, '%28').replace(/\)/g, '%29');
            const model: string = queryParams.model.replace(/\(/g, '%28').replace(/\)/g, '%29');
            const productType: string = queryParams.productType.replace(/\(/g, '%28').replace(/\)/g, '%29');
            const productSubtype: string = queryParams.productSubtype.replace(/\(/g, '%28').replace(/\)/g, '%29');

            return this.http.post('/api/salesportal/products-by-brand-model', {
              location: this.user.locationCode,
              brand: brand,
              model: model,
              offset: '1',
              maxrow: '1',
              productType: [productType],
              productSubtype: [productSubtype]
            }).toPromise()
              .then((respBrandModel: any) => {

                const products = respBrandModel.data.products || {};
                if (products[0].flag5G === 'Y') {

                  return this.http.post(`/api/customerportal/check-handset-sim-5G`, {
                    cmd: 'CHECK',
                    msisdn: mobileNo,
                    channel: 'WEB'
                  }).toPromise()
                    .then((resp5G: any) => {
                      const handsetSim5G: HandsetSim5G = resp5G.data || {} as HandsetSim5G;
                      this.transaction.data.handsetSim5G = handsetSim5G;
                      this.transaction.data.handsetSim5G.handset = 'Y';

                      this.message5G = this.mapMessage5G(handsetSim5G);
                      this.messageVolTE = this.mapMessageVOTE(handsetSim5G);

                      return this.transaction.data.handsetSim5G;
                    })
                    .catch((error: any) => {
                      const errObj: any = error.error || [];
                      const messageError = errObj.developerMessage ? errObj.developerMessage : 'ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้';
                      this.message5G = messageError;
                      this.messageVolTE = messageError;
                      delete this.transaction.data.handsetSim5G;
                      return messageError;
                    });

                }

              }).catch((error: any) => {
              });

          }
        }).catch((error: any) => {
        });

    };
  }

  isEngLanguage(): boolean {
    return this.translateService.currentLang === 'EN';
  }

  mapMessage5G(handsetSim5G: HandsetSim5G): string {
    const map = handsetSim5G.sim + handsetSim5G.handset + handsetSim5G.isMultisim + (handsetSim5G.sharePlan ? 'Y' : 'N');
    const message5G = {
      'YYNN': '5G พร้อมใช้งาน แนะนำสมัครแพ็กเกจ 5G',
      'YYNY': 'แนะนำยกเลิก Share Plan และสมัครแพ็กเกจ 5G',
      'YYYN': 'แนะนำยกเลิกบริการ MultiSIM และสมัครแพ็กเกจ 5G',
      'YYYY': 'แนะนำยกเลิกบริการ MultiSIM และยกเลิก Share Plan',
      'NYNN': 'แนะนำเปลี่ยน SIM และสมัครแพ็กเกจ 5G',
      'NYNY': 'แนะนำเปลี่ยน SIM, ยกเลิก Share Plan และสมัครแพ็กเกจ 5G',
      'NYYN': 'แนะนำเปลี่ยน SIM, ยกเลิกบริการ MultiSIM และสมัครแพ็กเกจ 5G',
      'NYYY': 'แนะนำเปลี่ยน SIM, ยกเลิกบริการ MultiSIM และยกเลิก Share Plan'
    };
    return message5G[map] || 'ไม่สามารถตรวจสอบข้อมูลได้ในขณะนี้';
  }
  mapMessageVOTE(handsetSim5G: HandsetSim5G): string {
    return handsetSim5G.volteHandset === 'Y' && handsetSim5G.volteService === 'N' ? 'แนะนำสมัคร HD Voice' : '';
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
