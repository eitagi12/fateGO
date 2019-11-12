import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_NEW_SHARE_PLAN_MNP_SELECT_PACKAGE_MASTER_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_SELECT_PACKAGE_MEMBER_PAGE } from '../../constants/route-path.constant';
import { WIZARD_ORDER_NEW_SHARE_PLAN_MNP } from 'src/app/order/constants/wizard.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService, PageLoadingService, REGEX_MOBILE } from 'mychannel-shared-libs';
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
  wizards: string[] = WIZARD_ORDER_NEW_SHARE_PLAN_MNP;
  transaction: Transaction;
  mnpForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private alertService: AlertService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.mnpForm = this.fb.group({
      'mobileNoMember': ['', Validators.compose([Validators.required, Validators.pattern(REGEX_MOBILE)])],
      'pinCode': ['', Validators.compose([Validators.required, Validators.pattern(/\d{8}/)])]
    });
  }

  onBack(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_SELECT_PACKAGE_MASTER_PAGE]);
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    const mobileNoMember = this.mnpForm.value.mobileNoMember;
    const subscriberId: string = mobileNoMember;
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
          this.alertService.error(`ระบบไม่สามารถทำรายการได้ <br>หมายเลข ${mobileNoMember}
          อยู่ระหว่างรอการอนุมัติย้ายค่ายมาใช้บริการกับ AIS ระบบรายเดือน/เติมเงิน
          (ทำรายการวันที่ ${createDate})`);
        } else {
          this.checkCustomerProfile();
        }
      }).catch(() => this.checkCustomerProfile());
  }

  checkCustomerProfile(): void {
    const mobileNoMember = this.mnpForm.value.mobileNoMember;
    this.http.post(`/api/customerportal/newRegister/getCCCustInfo/${mobileNoMember}`, {
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

        if (!outbuf || (accountNo && (mobileNoStatus === 'Disconnect - Ported' || mobileNoStatus === 'U' || mobileNoStatus === 'T' ||
          mobileNoStatus === '')) || mobileNoStatus !== 'Active' && !(mobileNoStatus || networkType) || mobileNoStatus === '') {
          this.transaction.data.simCard = {
            ...this.transaction.data.simCard,
            mobileNoMember: mobileNoMember,
            pinCode: this.mnpForm.value.pinCode
          };
          this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_SELECT_PACKAGE_MEMBER_PAGE]);
        } else {
          return this.alertService.error(`หมายเลข ${mobileNoMember} เป็นเบอร์ AIS`);
        }
      }).catch(() => {
        this.pageLoadingService.closeLoading();
        this.transaction.data.simCard = {
          ...this.transaction.data.simCard,
          mobileNoMember: mobileNoMember,
          pinCode: this.mnpForm.value.pinCode
        };
      })
      .then(() => {
        this.pageLoadingService.closeLoading();
      });
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}
