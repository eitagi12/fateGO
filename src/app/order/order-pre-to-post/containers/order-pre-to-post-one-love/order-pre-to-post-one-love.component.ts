import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_ORDER_PRE_TO_POST } from 'src/app/order/constants/wizard.constant';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { OneLove, HomeService, AlertService, PageLoadingService } from 'mychannel-shared-libs';

import { TransactionService } from 'src/app/shared/services/transaction.service';
import {
  ROUTE_ORDER_PRE_TO_POST_SELECT_PACKAGE_PAGE,
  ROUTE_ORDER_PRE_TO_POST_ON_TOP_PAGE,
  ROUTE_ORDER_PRE_TO_POST_ONE_LOVE_PAGE
} from 'src/app/order/order-pre-to-post/constants/route-path.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-pre-to-post-one-love',
  templateUrl: './order-pre-to-post-one-love.component.html',
  styleUrls: ['./order-pre-to-post-one-love.component.scss']
})
export class OrderPreToPostOneLoveComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_ORDER_PRE_TO_POST;

  oneLove: OneLove;
  transaction: Transaction;
  mobileOneLove: string[];
  isError: boolean;

  translationSubscribe: Subscription;

  constructor(
    private router: Router,
    private http: HttpClient,
    private homeService: HomeService,
    private alertService: AlertService,
    private transactionService: TransactionService,
    private pageLoadingService: PageLoadingService,
    private translation: TranslateService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    const mainPackage = this.transaction.data.mainPackage;
    const numberOfMobile = mainPackage ? +mainPackage.numberOfMobile : 0;
    this.oneLove = {
      numberOfMobile: numberOfMobile,
      mainPackageText: mainPackage.shortNameThai
    };
    this.oneLoveByLang();
    this.translationSubscribe = this.translation.onLangChange.subscribe(lang => {
      this.oneLoveByLang();
    });
  }

  oneLoveByLang(): void {
    const mainPackage = this.transaction.data.mainPackage;
    if (this.translation.currentLang === 'EN') {
      this.oneLove.mainPackageText = mainPackage.shortNameEng;
    } else {
      this.oneLove.mainPackageText = mainPackage.shortNameThai;
    }
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): void {
    this.router.navigate([ROUTE_ORDER_PRE_TO_POST_SELECT_PACKAGE_PAGE]);
  }

  onNext(): void {
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

    this.router.navigate([ROUTE_ORDER_PRE_TO_POST_ON_TOP_PAGE]);
  }

  getParameterName(parameters: any[], name: string): any {
    let parameter = parameters.find((param: any) => {
      return param.Name === name;
    });

    if (!parameter) {
      parameter = {};
    }
    return parameter;
  }

  onCompleted(value: any): void {
    this.mobileOneLove = value;
  }

  onError(error: boolean): void {
    this.isError = error;
  }

  ngOnDestroy(): void {
    this.translationSubscribe.unsubscribe();
    this.transactionService.update(this.transaction);
  }

  callService(mobileNo: string): Promise<void> {

    // this.pageLoadingService.openLoading();

    return new Promise((resolve, reject) => {

      this.http.get(`/api/customerportal/customerprofile/${mobileNo}`).toPromise()
        .then((resp: any) => {
          const data = resp.data || {};

          const mobileStatus = (data.mobileStatus || '').toLowerCase();
          if (environment.MOBILE_STATUS.indexOf(mobileStatus) === -1) {
            this.alertService.error(this.translation.instant('หมายเลขดังกล่าวไม่สามารถใช้งานได้'));
            return reject();
          }
          // this.pageLoadingService.closeLoading();
          return resolve();
        })
        .catch(() => {
          // this.pageLoadingService.closeLoading();
          this.alertService.error(this.translation.instant('หมายเลขดังกล่าวไม่ใช่เครือข่าย AIS'));
          reject();
        });
    });
  }
}
