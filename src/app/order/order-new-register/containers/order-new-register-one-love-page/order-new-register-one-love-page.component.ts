import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_ORDER_NEW_REGISTER } from 'src/app/order/constants/wizard.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { HomeService, Utils, AlertService, PageLoadingService, OneLove } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Router } from '@angular/router';
import {
  ROUTE_ORDER_NEW_REGISTER_ON_TOP_PAGE, ROUTE_ORDER_NEW_REGISTER_SELECT_PACKAGE_PAGE
} from 'src/app/order/order-new-register/constants/route-path.constant';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-new-register-one-love-page',
  templateUrl: './order-new-register-one-love-page.component.html',
  styleUrls: ['./order-new-register-one-love-page.component.scss']
})
export class OrderNewRegisterOneLovePageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_ORDER_NEW_REGISTER;
  transaction: Transaction;
  translationSubscribe: Subscription;

  oneLove: OneLove;
  oneLoveForm: FormGroup;
  mobileOneLove: string[];
  isError: boolean;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private homeService: HomeService,
    private alertService: AlertService,
    private utils: Utils,
    private http: HttpClient,
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
    this.router.navigate([ROUTE_ORDER_NEW_REGISTER_SELECT_PACKAGE_PAGE]);
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

    this.router.navigate([ROUTE_ORDER_NEW_REGISTER_ON_TOP_PAGE]);
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

  callService(mobileNo: string): Promise<void> {

    this.pageLoadingService.openLoading();
    return new Promise((resolve, reject) => {

      this.http.get(`/api/customerportal/customerprofile/${mobileNo}`).toPromise()
        .then((resp: any) => {
          const data = resp.data || {};

          const mobileStatus = (data.mobileStatus || '').toLowerCase();
          if (environment.MOBILE_STATUS.indexOf(mobileStatus) === -1) {
            this.alertService.error(this.translation.instant('หมายเลขดังกล่าวไม่สามารถใช้งานได้'));
            return reject();
          }
          this.pageLoadingService.closeLoading();
          return resolve();
        })
        .catch(() => {
          this.pageLoadingService.closeLoading();
          this.alertService.error(this.translation.instant('หมายเลขดังกล่าวไม่ใช่เครือข่าย AIS'));
          reject();
        });
    });
  }

  ngOnDestroy(): void {
    this.translationSubscribe.unsubscribe();
    this.transactionService.update(this.transaction);
  }

}
