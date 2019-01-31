import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { MobileNoCondition, HomeService, TokenService, PageLoadingService, User, ShoppingCart } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { WIZARD_DEVICE_ORDER_AIS } from '../../../../constants/wizard.constant';
import { ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_SELECT_PACKAGE_PAGE, ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_SELECT_NUMBER_PAGE } from '../../constants/route-path.constant';
import { ShoppingCartService } from 'src/app/device-order/ais/device-order-ais-new-register/service/shopping-cart.service';

@Component({
  selector: 'app-device-order-ais-new-register-by-pattern-page',
  templateUrl: './device-order-ais-new-register-by-pattern-page.component.html',
  styleUrls: ['./device-order-ais-new-register-by-pattern-page.component.scss']
})
export class DeviceOrderAisNewRegisterByPatternPageComponent implements OnInit, OnDestroy {
  wizards = WIZARD_DEVICE_ORDER_AIS;

  transaction: Transaction;
  mobileNoConditions: MobileNoCondition[];

  isSearchAgain = false;
  mobileNoConditionForm: FormGroup;
  element: any;
  el = [];
  user: User;
  shoppingCart: ShoppingCart;
  constructor(
    private router: Router,
    private homeService: HomeService,
    private tokenService: TokenService,
    private transactionService: TransactionService,
    private pageLoadingService: PageLoadingService,
    private http: HttpClient,
    public fb: FormBuilder,
    private shoppingCartService: ShoppingCartService,
  ) {
    this.transaction = this.transactionService.load();
    this.user = this.tokenService.getUser();

  }

  ngOnInit() {
    delete this.transaction.data.simCard;
    this.shoppingCart = Object.assign(this.shoppingCartService.getShoppingCartData(), {
      mobileNo: ''
    });
    this.createForm();
  }

  createForm() {
    this.mobileNoConditionForm = this.fb.group({
      summary: ['', [Validators.pattern(/\d/)]],
      like0: ['', [Validators.pattern(/\d/)]],
      like1: ['', [Validators.pattern(/\d/)]],
      like2: ['', [Validators.pattern(/\d/)]],
      notLike0: ['', [Validators.pattern(/\d/)]],
      notLike1: ['', [Validators.pattern(/\d/)]],
      notLike2: ['', [Validators.pattern(/\d/)]],
      // mobileFormat0: [{ value: 0, disabled: true }],
      mobileFormat1: ['', [Validators.pattern(/\d/)]],
      mobileFormat2: ['', [Validators.pattern(/\d/)]],
      mobileFormat3: ['', [Validators.pattern(/\d/)]],
      mobileFormat4: ['', [Validators.pattern(/\d/)]],
      mobileFormat5: ['', [Validators.pattern(/\d/)]],
      mobileFormat6: ['', [Validators.pattern(/\d/)]],
      mobileFormat7: ['', [Validators.pattern(/\d/)]],
      mobileFormat8: ['', [Validators.pattern(/\d/)]],
      mobileFormat9: ['', [Validators.pattern(/\d/)]]
    });
  }

  onBack() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_SELECT_NUMBER_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }

  onSearch(mobileNoCondition: any) {
    this.pageLoadingService.openLoading();

    this.http.get('/api/salesportal/location-by-code', {
      params: { code: this.user.locationCode }
    }).toPromise()
      .then((resp: any) => {
        return this.http.post('/api/customerportal/newRegister/queryMobileNoByConditions', {
          channel: 'MyChannel',
          classifyCode: 'All',
          like: mobileNoCondition.like,
          locationCd: this.user.locationCode,
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


  onNextTab(event: any): void {
    console.log('event', event);
    const keyCode: number = (event.which) ? event.which : event.keyCode;
    const target: any = event.target;
    // backspace
    if (target.value === 'undefined' || event.target.value === '') {
      const previousField: any = target.previousElementSibling;
      if (keyCode === 8) {
        if (previousField) {
          previousField.focus();
        }
      }
      return;
    }

    const nextField: any = target.nextElementSibling;

    if (!nextField) {
      return;
    }
    nextField.focus();

  }

  onSearchMobileNoByCondition() {
    this.isSearchAgain = true;
    const serch = {
      summary: this.mobileNoConditionForm.controls['summary'].value || '',
      like: (() => {
        return ['like0', 'like1', 'like2'].map(controlName => {
          return this.mobileNoConditionForm.controls[controlName].value;
        }).filter(like => like).join(',');
      })(),
      notLike: (() => {
        return ['notLike0', 'notLike1', 'notLike2'].map(controlName => {
          return this.mobileNoConditionForm.controls[controlName].value;
        }).filter(like => like).join(',');
      })(),
      mobileFormat: (() => {
        return '0' + [
          'mobileFormat1', 'mobileFormat2', 'mobileFormat3',
          'mobileFormat4', 'mobileFormat5', 'mobileFormat6',
          'mobileFormat7', 'mobileFormat8', 'mobileFormat9'].map(controlName => {
            return this.mobileNoConditionForm.controls[controlName].value || '_';
          }).join('');
      })()
    };
    this.onSearch(serch);
  }

  onSelectMobileNo(value: any) {
    this.transaction.data.simCard = {
      mobileNo: value.mobileNo,
      persoSim: true
    };
  }

  onNext() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_SELECT_PACKAGE_PAGE]);
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}
