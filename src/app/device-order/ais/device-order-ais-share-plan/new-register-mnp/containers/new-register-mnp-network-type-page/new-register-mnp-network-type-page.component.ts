import { Component, OnInit, OnDestroy } from '@angular/core';
import { Transaction, TransactionType } from 'src/app/shared/models/transaction.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HomeService, AlertService, PageLoadingService, REGEX_MOBILE, ShoppingCart, PromotionShelve, BillingSystemType } from 'mychannel-shared-libs';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { PromotionShelveService } from 'src/app/device-order/services/promotion-shelve.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN } from 'src/app/device-order/constants/wizard.constant';
import { ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_CONFIRM_USER_INFORMATION_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-new-register-mnp-network-type-page',
  templateUrl: './new-register-mnp-network-type-page.component.html',
  styleUrls: ['./new-register-mnp-network-type-page.component.scss']
})
export class NewRegisterMnpNetworkTypePageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN;

  transaction: Transaction;
  priceOption: PriceOption;
  mnpForm: FormGroup;
  shoppingCart: ShoppingCart;
  promotionShelves: PromotionShelve[];
  translateSubscription: Subscription;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private fb: FormBuilder,
    private http: HttpClient,
    private alertService: AlertService,
    private pageLoadingService: PageLoadingService,
    private priceOptionService: PriceOptionService,
    private transactionService: TransactionService,
    private shoppingCartService: ShoppingCartService,
    private promotionShelveService: PromotionShelveService,
    private translateService: TranslateService
  ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();
    this.homeService.callback = () => {
      window.location.href = '/smart-digital/main-menu';
    };
    this.translateSubscription = this.translateService.onLangChange.subscribe((lang: any) => {
      if (this.promotionShelves) {
        this.checkTranslateLang(lang);
      }
    });
  }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    // this.createTransaction();
    this.createForm();
    this.callService();
  }

  createForm(): void {
    this.mnpForm = this.fb.group({
      'mobileNo': ['', Validators.compose([Validators.required, Validators.pattern(REGEX_MOBILE)])],
      'pinCode': ['', Validators.compose([Validators.required, Validators.pattern(/\d{8}/)])]
    });
  }

  onBack(): void {
    this.homeService.goToHome();
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    const subscriberId: string = this.mnpForm.value.mobileNo;
    const orderType: string = 'Port - In';
    const isProduction: any = environment.name !== 'PROD' && environment.name !== 'SIT' ? true : false;
    const isStartDt: any = isProduction === true ? 30 : 3;
    const startDt: string = encodeURIComponent(moment().subtract(isStartDt, 'days').format('YYYYMMDD HH:mm:ss'));
    const endDt: string = encodeURIComponent(moment().format('YYYYMMDD HH:mm:ss'));
    this.http.get(`/api/customerportal/newRegister/history-order`, {
      params: {
        subscriberId: subscriberId,
        orderType: orderType,
        startDt: startDt,
        endDt: endDt
      }
    })
      .toPromise()
      .then((resp: any) => {
        const historyOrder = (resp.data || []).find((order: any) => {
          return order.statusCode === 'Submit for Approve'
            || order.statusCode === 'Pending'
            || order.statusCode === 'Submitted'
            || order.statusCode === 'Await'
            || order.statusCode === 'Accept'
            || order.statusCode === 'Approve';
        });
        if (historyOrder) {
          this.pageLoadingService.closeLoading();
          const createDate = moment(historyOrder.createDate, 'YYYYMMDD').format('DD/MM/YYYY');
          this.alertService.error(`ระบบไม่สามารถทำรายการได้ <br>หมายเลข ${this.mnpForm.value.mobileNo}
          อยู่ระหว่างรอการอนุมัติย้ายค่ายมาใช้บริการกับ AIS ระบบรายเดือน/เติมเงิน
          (ทำรายการวันที่ ${createDate})`);
        } else {
          this.checkCustomerProfile();
        }
      }).catch(() => this.checkCustomerProfile());
  }

  checkCustomerProfile(): void {
    this.http.post(`/api/customerportal/newRegister/getCCCustInfo/${this.mnpForm.value.mobileNo}`, {
    }).toPromise()
      .then((resp: any) => {
        this.pageLoadingService.closeLoading();
        const outbuf = resp.data
          && resp.data.data
          && resp.data.data.A_GetCCCustInfoResponse
          && resp.data.data.A_GetCCCustInfoResponse.outbuf
          ? resp.data.data.A_GetCCCustInfoResponse.outbuf : {};

        const mobileNoStatus = (outbuf.mobileNoStatus || '').trim();
        const networkType = (outbuf.networkType || '').trim();
        const accountNo = (outbuf.accountNo || '').trim();

        if (!outbuf || (accountNo && (mobileNoStatus === 'Disconnect - Ported' || mobileNoStatus === 'U' || mobileNoStatus === 'T'))
          || mobileNoStatus !== 'Active' && !(mobileNoStatus || networkType)) {
          this.transaction.data.simCard = {
            ...this.transaction.data.simCard,
            memberMobileNo: this.mnpForm.value.mobileNo
          };
          // this.transaction.data.customer = {
          //   customerPinCode: this.mnpForm.value.pinCode,
          //   birthdate: '',
          //   idCardNo: '',
          //   idCardType: 'บัตรประชาชน',
          //   titleName: '',
          //   expireDate: '',
          //   firstName: '',
          //   gender: '',
          //   lastName: ''
          // };
          this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_CONFIRM_USER_INFORMATION_PAGE]);
        } else {
          return this.alertService.error(`หมายเลข ${this.mnpForm.value.mobileNo} เป็นเบอร์ AIS`);
        }
      }).catch(() => {
        this.pageLoadingService.closeLoading();
        this.transaction.data.simCard = {
          ...this.transaction.data.simCard,
          memberMobileNo: this.mnpForm.value.mobileNo
        };
        // this.transaction.data.customer = {
        //   customerPinCode: this.mnpForm.value.pinCode,
        //   birthdate: '',
        //   idCardNo: '',
        //   idCardType: 'บัตรประชาชน',
        //   titleName: '',
        //   expireDate: '',
        //   firstName: '',
        //   gender: '',
        //   lastName: ''
        // };
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_CONFIRM_USER_INFORMATION_PAGE]);
      })
      .then(() => {
        this.pageLoadingService.closeLoading();
      });
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  private createTransaction(): void {
    this.transaction = {
      data: {
        transactionType: TransactionType.ORDER_MNP,
        action: null,
      }
    };
  }

  callService(): void {
    this.pageLoadingService.openLoading();

    const trade: any = this.priceOption.trade;
    const privilege: any = this.priceOption.privilege;

    this.promotionShelveService.getPromotionShelve(
      {
        packageKeyRef: trade.packageKeyRef || privilege.packageKeyRef,
        orderType: 'New Registration',
        billingSystem: BillingSystemType.IRB
      },
      +privilege.minimumPackagePrice, +privilege.maximumPackagePrice)
      .then((promotionShelves: any) => {
        this.promotionShelves = this.promotionShelveService.defaultBySelected(promotionShelves, this.transaction.data.mainPackage);
        if (this.promotionShelves) {
          this.checkTranslateLang(this.translateService.currentLang);
        }
      })
      .then(() => this.pageLoadingService.closeLoading());
  }

  checkTranslateLang(lang: any): void {
    this.mapKeyTranslateSelectPackageTitle(this.promotionShelves).then(translateKey => {
      if (lang === 'EN' || lang.lang === 'EN' || lang === 'en' || lang.lang === 'en') {
        if (translateKey && lang && lang.translations) {
          const merge = { ...translateKey, ...lang.translations } || {};
          this.translateService.setTranslation('EN', merge);
        } else {
          this.getTranslateLoader('device-order', 'EN').then(resp => {
            const merge = { ...translateKey, ...resp } || {};
            this.translateService.setTranslation('EN', merge);
          });
        }
      }
    });
  }

  mapKeyTranslateSelectPackageTitle(promotionShelves: PromotionShelve[]): Promise<any> {
    const map = new Map();
    const TranslateKey = {};
    promotionShelves.filter(promotionShelve => {
      promotionShelve.promotions.map(key => key.items.map(item => {
        let replaceTitle = item.title.replace('บ.', '฿');
        replaceTitle = replaceTitle.replace('บาท', '฿');
        replaceTitle = replaceTitle.replace('แพ็กเกจ', 'Package');
        map.set([item.title.trim()], replaceTitle.trim() || item.title.trim());
      }));
    });
    map.forEach((value: any, key: any) => {
      TranslateKey[key] = value;
    });
    if (TranslateKey) {
      return Promise.resolve(TranslateKey);
    } else {
      return Promise.resolve(null);
    }
  }

  getTranslateLoader(moduleName: string, lang: string): Promise<any> {
    if (!moduleName || !lang) {
      return;
    }
    const fileLang = `i18n/${moduleName}.${lang}.json`.toLowerCase();
    return this.http.get(fileLang).toPromise();
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }

}
