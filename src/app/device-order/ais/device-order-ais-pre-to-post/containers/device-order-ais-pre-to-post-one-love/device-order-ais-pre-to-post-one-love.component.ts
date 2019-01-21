import { Component, OnInit, OnDestroy } from '@angular/core';
import { OneLove, HomeService, AlertService, PageLoadingService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { WIZARD_ORDER_PRE_TO_POST } from 'src/app/order/constants/wizard.constant';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import {
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_SELECT_PACKAGE_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_ON_TOP_PAGE
} from '../../constants/route-path.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-device-order-ais-pre-to-post-one-love',
  templateUrl: './device-order-ais-pre-to-post-one-love.component.html',
  styleUrls: ['./device-order-ais-pre-to-post-one-love.component.scss']
})
export class DeviceOrderAisPreToPostOneLoveComponent implements OnInit, OnDestroy {

  wizards = WIZARD_ORDER_PRE_TO_POST;

  oneLove: OneLove;
  transaction: Transaction;
  mobileOneLove: string[];
  isError: boolean;

  constructor(
    private router: Router,
    private http: HttpClient,
    private homeService: HomeService,
    private alertService: AlertService,
    private transactionService: TransactionService,
    private pageLoadingService: PageLoadingService) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit() {
    const mainPackage = this.transaction.data.mainPackage;
    const numberOfMobile = mainPackage ? +mainPackage.numberOfMobile : 0;
    this.oneLove = {
      numberOfMobile: numberOfMobile,
      mainPackageText: mainPackage.shortNameThai
    };
  }

  onHome() {
    this.homeService.goToHome();
  }

  onBack() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_SELECT_PACKAGE_PAGE]);
  }

  onNext() {
    const mainPackage = this.transaction.data.mainPackage;
    const parameters = mainPackage.parameters || [];


    this.transaction.data.mainPackageOneLove = this.mobileOneLove.map((mobileNo: string, index: number) => {
      const parameter: any[] = parameters[index].Parameter;

      return [{
        Name: 'attributeName',
        Value: this.getParameterName(parameter, 'attributeName').Value
      }, {
        Name: 'attributeValue',
        Value: mobileNo
      }, {
        Name: 'requireFlag',
        Value: this.getParameterName(parameter, 'requireFlag').Value
      }];
    });

    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_ON_TOP_PAGE]);
  }

  getParameterName(parameters: any[], name: string) {
    let parameter = parameters.find((param: any) => {
      return param.Name === name;
    });

    if (!parameter) {
      parameter = {};
    }
    return parameter;
  }

  onCompleted(value: any) {
    this.mobileOneLove = value;
  }

  onError(error: boolean) {
    this.isError = error;
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  callService(mobileNo: string): Promise<void> {

    this.pageLoadingService.openLoading();

    return new Promise((resolve, reject) => {

      this.http.get(`/api/customerportal/customerprofile/${mobileNo}`).toPromise()
        .then((resp: any) => {
          const data = resp.data || {};

          const mobileStatus = (data.mobileStatus || '').toLowerCase();
          if (environment.MOBILE_STATUS.indexOf(mobileStatus) === -1) {
            this.alertService.error('หมายเลขดังกล่าวไม่สามารถใช้งานได้');
            return reject();
          }
          this.pageLoadingService.closeLoading();
          return resolve();
        })
        .catch(() => {
          this.pageLoadingService.closeLoading();
          this.alertService.error('หมายเลขดังกล่าวไม่ใช่เครือข่าย AIS');
          reject();
        });
    });
  }
}
