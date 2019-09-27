import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_NEW_SHARE_PLAN_MNP_SELECT_PACKAGE_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_CONFIRM_USER_INFORMATION_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_NETWORK_TYPE_PAGE } from '../../constants/route-path.constant';
import { WIZARD_ORDER_MNP } from 'src/app/order/constants/wizard.constant';
import { Transaction, TransactionType } from 'src/app/shared/models/transaction.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HomeService, AlertService, PageLoadingService, REGEX_MOBILE } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-new-share-plan-mnp-network-type-page',
  templateUrl: './new-share-plan-mnp-network-type-page.component.html',
  styleUrls: ['./new-share-plan-mnp-network-type-page.component.scss']
})
export class NewSharePlanMnpNetworkTypePageComponent implements OnInit, OnDestroy {
  wizards: string[] = WIZARD_ORDER_MNP;
  transaction: Transaction;
  sharePlanForm: FormGroup;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private fb: FormBuilder,
    private http: HttpClient,
    private alertService: AlertService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
  ) {
    this.transaction = this.transactionService.load();
    this.homeService.callback = () => {
      window.location.href = '/smart-digital/main-menu';
    };
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.sharePlanForm = this.fb.group({
      'mobileNo': ['', Validators.compose([Validators.required, Validators.pattern(REGEX_MOBILE)])],
      'pinCode': ['', Validators.compose([Validators.required, Validators.pattern(/\d{8}/)])]
    });
  }

  checkCustomerProfile(): void {
    this.http.post(`/api/customerportal/newRegister/getCCCustInfo/${this.sharePlanForm.value.mobileNo}`, {
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
            mobileMember: this.sharePlanForm.value.mobileNo
          };
          this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_CONFIRM_USER_INFORMATION_PAGE]);
        } else {
          return this.alertService.error(`หมายเลข ${this.sharePlanForm.value.mobileNo} เป็นเบอร์ AIS`);
        }
      }).catch(() => {
        this.pageLoadingService.closeLoading();
        this.transaction.data.simCard = {
          ...this.transaction.data.simCard,
          mobileMember: this.sharePlanForm.value.mobileNo
        };
        this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_NETWORK_TYPE_PAGE]);
      })
      .then(() => {
        this.pageLoadingService.closeLoading();
      });

  }

  onHome(): void {
    this.router.navigate([]);
  }

  onBack(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_SELECT_PACKAGE_PAGE]);
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    const subscriberId: string = this.sharePlanForm.value.mobileNo;
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
          this.alertService.error(`ระบบไม่สามารถทำรายการได้ <br>หมายเลข ${this.sharePlanForm.value.mobileNo}
          อยู่ระหว่างรอการอนุมัติย้ายค่ายมาใช้บริการกับ AIS ระบบรายเดือน/เติมเงิน
          (ทำรายการวันที่ ${createDate})`);
        } else {
          this.checkCustomerProfile();
        }
      }).catch(() => this.checkCustomerProfile());
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}
