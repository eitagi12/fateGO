import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { PageLoadingService, AlertService, HomeService, ShoppingCart, TokenService, User } from 'mychannel-shared-libs';

import { WIZARD_DEVICE_ORDER_AIS } from '../../../../constants/wizard.constant';
import {
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_ELIGIBLE_MOBILE_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_VALIDATE_CUSTOMER_ID_CARD_REPI_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_PAYMENT_DETAIL_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_VALIDATE_CUSTOMER_PAGE
} from '../../constants/route-path.constant';
import { Transaction, TransactionAction, HandsetSim5G } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { TranslateService } from '@ngx-translate/core';

export interface Balance {
  remainingBalance: number;
  transferBalance: number;
  validityDate: string;
}
export interface CurrentServices {
  canTransfer: boolean;
  serviceCode: string;
  serviceName: string;
}

@Component({
  selector: 'app-device-order-ais-pre-to-post-current-info-page',
  templateUrl: './device-order-ais-pre-to-post-current-info-page.component.html',
  styleUrls: ['./device-order-ais-pre-to-post-current-info-page.component.scss']
})
export class DeviceOrderAisPreToPostCurrentInfoPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;
  isLoad: boolean = true;
  mobileNo: string;
  transaction: Transaction;
  priceOption: PriceOption;
  user: User;
  // shoppingCart: ShoppingCart;

  modalRef: BsModalRef;
  balance: Balance;

  serviceChange: CurrentServices[];
  serviceAfterChanged: CurrentServices[];

  message5G: string;
  messageVolTE: string;

  constructor(
    private router: Router,
    private http: HttpClient,
    private modalService: BsModalService,
    private alertService: AlertService,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private tokenService: TokenService,
    private priceOptionService: PriceOptionService,
    private translateService: TranslateService
  ) {
    this.user = this.tokenService.getUser();
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
    this.mobileNo = this.transaction.data.simCard.mobileNo;

    this.pageLoadingService.openLoading();

    const getBalancePromise = this.http.get(`/api/customerportal/newRegister/${this.mobileNo}/getBalance`)
      .toPromise().catch(() => {
        return {};
      });
    const queryCurrentServicesPromise = this.http.get(`/api/customerportal/newRegister/${this.mobileNo}/queryCurrentServices`)
      .toPromise().catch(() => {
        return {};
      });

    const queryCheckHandsetSim5G = this.http.post('/api/easyapp/configMC', {
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
                  msisdn: this.mobileNo,
                  channel: 'WEB'
                }).toPromise()
                  .then((resp5G: any) => {
                    const handsetSim5G: HandsetSim5G = resp5G.data || {} as HandsetSim5G;
                    this.transaction.data.handsetSim5G = handsetSim5G;
                    this.transaction.data.handsetSim5G.handset = 'Y';
                    return this.transaction.data.handsetSim5G;
                  })
                  .catch((error: any) => {
                    const errObj: any = error.error || [];
                    delete this.transaction.data.handsetSim5G;
                    return errObj.developerMessage ? errObj.developerMessage : 'ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้';
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

    Promise.all([getBalancePromise, queryCurrentServicesPromise, queryCheckHandsetSim5G]).then((res: any[]) => {
      this.balance = res[0].data || {};
      this.balance.remainingBalance = Number(this.balance.remainingBalance) / 100;

      const currentServices = res[1].data || [];
      this.serviceChange = currentServices.services.filter(service => service.canTransfer);
      this.serviceAfterChanged = currentServices.services.filter(service => !service.canTransfer);

      const handsetSim5G: HandsetSim5G = res[2] || {};
      this.message5G = typeof res[2] === 'string' ? res[2] : this.mapMessage5G(handsetSim5G);
      this.messageVolTE = typeof res[2] === 'string' ? res[2] : this.mapMessageVOTE(handsetSim5G);

      this.pageLoadingService.closeLoading();
      this.isLoad = false;
    }).catch(() => {
      this.pageLoadingService.closeLoading();
      this.isLoad = false;
    });
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_ELIGIBLE_MOBILE_PAGE]);

    const action = this.transaction.data.action;
    if (action === TransactionAction.KEY_IN || action === TransactionAction.READ_CARD || action === TransactionAction.READ_PASSPORT) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_ELIGIBLE_MOBILE_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_VALIDATE_CUSTOMER_PAGE]);
    }

  }

  onNext(): void {
    const action = this.transaction.data.action;

    if (action === TransactionAction.READ_CARD || action === TransactionAction.READ_PASSPORT) {

      this.pageLoadingService.openLoading();

      this.http.get('/api/customerportal/validate-customer-mobile-no-pre-to-post', {
        params: {
          mobileNo: this.mobileNo
        }
      }).toPromise()
        .then((resp: any) => {
          this.transaction.data.simCard = { mobileNo: this.mobileNo, persoSim: false };
          this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_PAYMENT_DETAIL_PAGE]);
          this.pageLoadingService.closeLoading();
        })
        .catch((resp: any) => {
          this.pageLoadingService.closeLoading();
          const error = resp.error || [];
          if (error && error.errors && typeof error.errors === 'string') {
            this.alertService.notify({
              type: 'error',
              html: this.translateService.instant(error.errors)
            });
          } else {
            Promise.reject(resp);
          }
        });
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_VALIDATE_CUSTOMER_ID_CARD_REPI_PAGE]);
    }
  }

  openModal(template: any): void {
    this.modalRef = this.modalService.show(template);
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
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
