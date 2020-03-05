import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Transaction, HandsetSim5G } from 'src/app/shared/models/transaction.model';
import { MobileCare, ShoppingCart, HomeService, PageLoadingService, AlertService, MobileInfo, TokenService, User } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { MobileCareService } from 'src/app/device-order/services/mobile-care.service';
import { ROUTE_DEVICE_ORDER_AIS_MNP_PAYMENT_DETAIL_PAGE, ROUTE_DEVICE_ORDER_AIS_MNP_ELIGIBLE_MOBILE_PAGE } from '../../constants/route-path.constant';
import { HttpClient } from '@angular/common/http';
import { Profile } from 'selenium-webdriver/firefox';
import { TranslateService } from '@ngx-translate/core';
import { Subscribable, Subscription } from 'rxjs';

export interface MobileNoUseTime {
  month: string;
  year: string;
}

@Component({
  selector: 'app-device-order-ais-mnp-mobile-detail-page',
  templateUrl: './device-order-ais-mnp-mobile-detail-page.component.html',
  styleUrls: ['./device-order-ais-mnp-mobile-detail-page.component.scss']
})
export class DeviceOrderAisMnpMobileDetailPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;

  priceOption: PriceOption;
  transaction: Transaction;
  shoppingCart: ShoppingCart;
  user: User;
  mcLoadingService: Promise<any>;

  mobileInfo: MobileInfo;
  translationSubscribe: Subscription;
  currentLang: string = 'TH';

  message5G: string;
  messageVolTE: string;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private tokenService: TokenService,
    private priceOptionService: PriceOptionService,
    private transactionService: TransactionService,
    private pageLoadingService: PageLoadingService,
    private shoppingCartService: ShoppingCartService,
    private mobileCareService: MobileCareService,
    private alertService: AlertService,
    private http: HttpClient,
    private translationService: TranslateService
  ) {
    this.user = this.tokenService.getUser();
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
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_ELIGIBLE_MOBILE_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_PAYMENT_DETAIL_PAGE]);
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
      const data = resp.data || {};
      const billingAccountList: any = [];
      const mobileNoList: any = [];
      data.billingAccountList.forEach(list => billingAccountList.push(list));
      billingAccountList.forEach(billings => mobileNoList.push(billings.mobileNo));

      // เช็คเบอร์ที่ทำรายการซ้ำกับ BA
      let isAirtime: boolean = false;
      if (this.priceOption.trade) {
        const trade = this.priceOption.trade;
        isAirtime = trade.advancePay.amount > 0 ? true : false;
      }
      const billCycles = this.transaction.data.billingInformation.billCycles;
      const mobileBillAccount = billCycles.map(billcycle => billcycle.mobileNo).find((mobile) => {
        return mobile.includes(mobileNoCurrent);
      });

      this.transaction.data.billingInformation.isNewBAFlag = mobileBillAccount && mobileBillAccount.length > 1 ? true : false;

      if (mobileBillAccount && mobileBillAccount.length > 1 && isAirtime) {
        this.alertService.warning(this.translationService.instant('หมายเลขนี้มีการรวมบิล ไม่สามารถทำรายการได้'))
          .then(() => {
            this.onBack();
          });
        return;
      }

      return this.getHandSetSim5G();
    }).then(() => this.pageLoadingService.closeLoading());
  }

  getHandSetSim5G(): Promise<any> {

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
                    return messageError;
                  });

              } else {
                return '';
              }

            }).catch((error: any) => {
              return '';
            });

        } else {
          return '';
        }
      }).catch((error: any) => {
        return '';
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

}
