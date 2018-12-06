import { Component, OnInit, OnDestroy } from '@angular/core';
import { MobileNoCondition, HomeService, TokenService, PageLoadingService } from 'mychannel-shared-libs';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_SELECT_NUMBER_PAGE,
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_SELECT_PACKAGE_PAGE
} from 'src/app/device-order/ais/device-order-ais-new-register/constants/route-path.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';

@Component({
  selector: 'app-device-order-ais-new-register-by-pattern-page',
  templateUrl: './device-order-ais-new-register-by-pattern-page.component.html',
  styleUrls: ['./device-order-ais-new-register-by-pattern-page.component.scss']
})
export class DeviceOrderAisNewRegisterByPatternPageComponent implements OnInit, OnDestroy {

  wizards = WIZARD_DEVICE_ORDER_AIS;

  transaction: Transaction;
  mobileNoConditions: MobileNoCondition[];

  constructor(
    private router: Router,
    private homeService: HomeService,
    private tokenService: TokenService,
    private transactionService: TransactionService,
    private pageLoadingService: PageLoadingService,
    private http: HttpClient
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit() {
    delete this.transaction.data.simCard;
  }

  onBack() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_SELECT_NUMBER_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }

  onSearch(mobileNoCondition: any) {
    this.pageLoadingService.openLoading();

    const user = this.tokenService.getUser();
    this.http.get('/api/salesportal/location-by-code', {
      params: { code: user.locationCode }
    }).toPromise()
      .then((resp: any) => {
        return this.http.post('/api/customerportal/newRegister/queryMobileNoByConditions', {
          channel: 'MyChannel',
          classifyCode: 'All',
          like: mobileNoCondition.like,
          locationCd: user.locationCode,
          mobileFormat: mobileNoCondition.mobileFormat,
          notLike: mobileNoCondition.notLike,
          partnerFlg: this.tokenService.isAspUser() ? 'Y' : 'N',
          refNo: '',
          region: resp.data.regionCode,
          summary: mobileNoCondition.summary,
        }).toPromise();
      })
      .then((resp: any) => {
        const conditions = resp.data || [];
        this.mobileNoConditions = conditions.map((condition: any) => {
          return {
            categoryName: condition.categoryName,
            mobileNo: condition.mobiles.map((mobile: any) => {
              return {
                mobileNo: mobile.mobileNo,
                summary: mobile.summary
              };
            })
          };
        }).filter((condition: any) => condition.mobileNo.length > 0);
      })
      .then(() => {
        this.pageLoadingService.closeLoading();
      });

  }

  onCompleted(value: any) {
    this.transaction.data.simCard = {
      mobileNo: value.mobileNo,
      persoSim: true
    };
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_SELECT_PACKAGE_PAGE]);
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}
