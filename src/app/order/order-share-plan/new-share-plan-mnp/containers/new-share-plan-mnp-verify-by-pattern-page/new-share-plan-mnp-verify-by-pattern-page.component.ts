import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_NEW_SHARE_PLAN_MNP_SELECT_NUMBER_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_SELECT_PACKAGE_MASTER_PAGE } from '../../constants/route-path.constant';
import { HomeService, MobileNoCondition, User, TokenService, PageLoadingService, AlertService } from 'mychannel-shared-libs';
import { WIZARD_ORDER_NEW_SHARE_PLAN_MNP } from 'src/app/order/constants/wizard.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { ReserveMobileService, SelectMobileNumberRandom } from 'src/app/order/order-shared/services/reserve-mobile.service';
@Component({
  selector: 'app-new-share-plan-mnp-verify-by-pattern-page',
  templateUrl: './new-share-plan-mnp-verify-by-pattern-page.component.html',
  styleUrls: ['./new-share-plan-mnp-verify-by-pattern-page.component.scss']
})
export class NewSharePlanMnpVerifyByPatternPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_ORDER_NEW_SHARE_PLAN_MNP;
  transaction: Transaction;
  mobileNoConditions: MobileNoCondition[] = [];
  isSearchAgain: boolean = false;
  mobileNoConditionForm: FormGroup;
  element: any;
  el: any[] = [];
  user: User;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private tokenService: TokenService,
    public fb: FormBuilder,
    private pageLoadingService: PageLoadingService,
    private http: HttpClient,
    private translation: TranslateService,
    private reserveMobileService: ReserveMobileService,
    private alertService: AlertService
  ) {
    this.transaction = this.transactionService.load();
    this.user = this.tokenService.getUser();
  }

  ngOnInit(): void {
    this.createForm();
  }

  onBack(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_SELECT_NUMBER_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  createForm(): void {
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

  onSearchMobileNoByCondition(): void {
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

  onSearch(mobileNoCondition: any): void {
    this.pageLoadingService.openLoading();
    delete this.transaction.data.simCard;

    this.http.get('/api/salesportal/location-by-code', { params: { code: this.user.locationCode } }).toPromise()
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
    const keyCode: number = (event.which) ? event.which : event.keyCode;
    const target: any = event.target;
    // backspace
    if (target.value === 'undefined' || target.value === '') {
      const previousField: any = target.previousElementSibling;
      // when backspace on keyboard
      if (keyCode === 8) {
        if (previousField) {
          previousField.focus();
        }
      } else { // when backspace on visualkeyboard
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

  onSelectMobileNo(value: any): void {
    this.transaction.data.simCard = {
      mobileNo: value.mobileNo,
      persoSim: true
    };
  }

  onNext(): void {
    const dataRequest: SelectMobileNumberRandom = {
      userId: this.user.username,
      mobileNo: this.transaction.data.simCard.mobileNo,
      action: 'Lock'
    };
    this.reserveMobileService.selectMobileNumberRandom(dataRequest)
      .then((resp: any) => {
        const data = resp.data || [];
        if (data.returnCode === '008') {
          this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_SELECT_PACKAGE_MASTER_PAGE]);
        } else if (data.returnCode === '002') {
          this.alertService.error(
            this.translation.instant('เบอร์') +
            this.transaction.data.simCard.mobileNo +
            this.translation.instant('มีลูกค้าท่านอื่นจองไว้แล้ว กรุณาเลือกเบอร์ใหม่'));
        } else {
          this.alertService.error(data.returnCode + ' ' + data.returnMessage);
        }
      });
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}
