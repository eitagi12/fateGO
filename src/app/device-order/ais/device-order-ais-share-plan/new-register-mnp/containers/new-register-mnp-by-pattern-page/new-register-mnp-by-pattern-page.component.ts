import { Component, OnInit, OnDestroy } from '@angular/core';
import { ShoppingCart, MobileNoCondition, MobileNo, User, HomeService, PageLoadingService, AlertService, TokenService } from 'mychannel-shared-libs';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { TranslateService } from '@ngx-translate/core';
import { ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_SELECT_NUMBER_PAGE, ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_SELECT_PACKAGE_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-new-register-mnp-by-pattern-page',
  templateUrl: './new-register-mnp-by-pattern-page.component.html',
  styleUrls: ['./new-register-mnp-by-pattern-page.component.scss']
})
export class NewRegisterMnpByPatternPageComponent implements OnInit, OnDestroy {
  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;

  shoppingCart: ShoppingCart;
  transaction: Transaction;
  mobileNoConditions: MobileNoCondition[];
  mobileNo: MobileNo;
  user: User;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private tokenService: TokenService,
    private transactionService: TransactionService,
    private pageLoadingService: PageLoadingService,
    private alertService: AlertService,
    private http: HttpClient,
    private shoppingCartService: ShoppingCartService,
  ) {
    this.transaction = this.transactionService.load();
    this.user = this.tokenService.getUser();
  }

  ngOnInit(): void {
    if (this.transaction.data.simCard &&
      this.transaction.data.simCard.mobileNo) {
      this.onResereMobileNo(this.transaction.data.simCard.mobileNo, 'Unlock');
    }
    // ลบข้อมูลที่เคยเลือก simcard ทิ้ง
    delete this.transaction.data.simCard;
    // อับเดดข้อมูลตะกร้า
    this.shoppingCart = Object.assign(this.shoppingCartService.getShoppingCartData(), {
      mobileNo: ''
    });
  }

  onSearch(mobileNoCondition: any): void {
    this.pageLoadingService.openLoading();

    this.http.get('/api/salesportal/location-by-code', {
      params: { code: this.user.locationCode }
    }).toPromise()
      .then((resp: any) => {
        return this.http.post('/api/customerportal/newRegister/queryMobileNoByConditions',
          Object.assign({
            channel: 'MyChannel',
            classifyCode: 'All',
            locationCd: this.user.locationCode,
            partnerFlg: this.tokenService.isAspUser() ? 'Y' : 'N',
            refNo: '',
            region: resp.data.regionCode,
          }, mobileNoCondition)).toPromise();
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
      }).catch((error: any) => {
        this.pageLoadingService.closeLoading();
        if (error && error.error && error.error.errors && error.error.resultDescription && error.error.errors.returnCode === '004') {
          this.alertService.warning(error.error.resultDescription);
        } else {
          return Promise.reject(error);
        }
      });
  }

  onCompleted(mobileNo: any): void {
    this.mobileNo = mobileNo;
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_SELECT_NUMBER_PAGE]);
  }

  onNext(): void {
    this.pageLoadingService.openLoading();

    const mobileNo = this.mobileNo.mobileNo;
    this.onResereMobileNo(mobileNo, 'Lock')
      .then((resp: any) => {
        const data = resp.data || {};

        if (data.returnCode === '008') {
          this.transaction.data.simCard = {
            mobileNo: mobileNo
          };
          this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_SELECT_PACKAGE_PAGE]);
          return;
        }

        if (data.returnCode === '002') {
          this.alertService.error('เบอร์ ' + this.transaction.data.simCard.mobileNo + ' มีลูกค้าท่านอื่นจองไว้แล้ว กรุณาเลือกเบอร์ใหม่');
        } else {
          this.alertService.error(data.returnCode + ' ' + data.returnMessage);
        }
      })
      .then(() => this.pageLoadingService.closeLoading());
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onResereMobileNo(mobileNo: string, action: string): Promise<any> {
    return this.http.post('/api/customerportal/newRegister/selectMobileNumberRandom', {
      userId: this.user.username,
      mobileNo: mobileNo,
      action: action
    }).toPromise();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}
