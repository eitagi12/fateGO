
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  HomeService, PageLoadingService, AlertService, REGEX_MOBILE
} from 'mychannel-shared-libs';
import {
  ROUTE_ORDER_MNP_SELECT_REASON_PAGE
} from 'src/app/order/order-mnp/constants/route-path.constant';
import { WIZARD_ORDER_MNP } from 'src/app/order/constants/wizard.constant';
import { Transaction, TransactionType } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-order-mnp-network-type-page',
  templateUrl: './order-mnp-network-type-page.component.html',
  styleUrls: ['./order-mnp-network-type-page.component.scss']
})
export class OrderMnpNetworkTypePageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_ORDER_MNP;

  transaction: Transaction;
  mnpForm: FormGroup;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private fb: FormBuilder,
    private http: HttpClient,
    private alertService: AlertService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
  ) {
    this.homeService.callback = () => {
      window.location.href = '/smart-digital/main-menu';
    };
  }

  ngOnInit(): void {
    this.createTransaction();
    this.createForm();
  }

  createForm(): void {
    this.mnpForm = this.fb.group({
      'mobileNo': ['', Validators.compose([Validators.required, Validators.pattern(REGEX_MOBILE)])],
      'pinCode': ['', Validators.compose([Validators.required, Validators.pattern(/\d{8}/)])]
    });
  }

  onBack(): void {
    this.homeService.goToHome();
  }
  onNext(): void {
    this.pageLoadingService.openLoading();
    const subscriberId: string = this.mnpForm.value.mobileNo;
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
          this.alertService.error(`ระบบไม่สามารถทำรายการได้ <br>หมายเลข ${this.mnpForm.value.mobileNo}
          อยู่ระหว่างรอการอนุมัติย้ายค่ายมาใช้บริการกับ AIS ระบบรายเดือน/เติมเงิน
          (ทำรายการวันที่ ${createDate})`);
        } else {
          this.checkCustomerProfile();
        }
      }).catch(() => this.checkCustomerProfile());
  }
  checkCustomerProfile(): void {
    this.http.post(`/api/customerportal/newRegister/getCCCustInfo/${this.mnpForm.value.mobileNo}`, {
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
            mobileNo: this.mnpForm.value.mobileNo
          };
          this.transaction.data.customer = {
            customerPinCode: this.mnpForm.value.pinCode,
            birthdate: '',
            idCardNo: '',
            idCardType: 'บัตรประชาชน',
            titleName: '',
            expireDate: '',
            firstName: '',
            gender: '',
            lastName: ''
          };
          this.router.navigate([ROUTE_ORDER_MNP_SELECT_REASON_PAGE]);
        } else {
          return this.alertService.error(`หมายเลข ${this.mnpForm.value.mobileNo} เป็นเบอร์ AIS`);
        }
      }).catch(() => {
        this.pageLoadingService.closeLoading();
        this.transaction.data.simCard = {
          mobileNo: this.mnpForm.value.mobileNo
        };
        this.transaction.data.customer = {
          customerPinCode: this.mnpForm.value.pinCode,
          birthdate: '',
          idCardNo: '',
          idCardType: 'บัตรประชาชน',
          titleName: '',
          expireDate: '',
          firstName: '',
          gender: '',
          lastName: ''
        };
        this.router.navigate([ROUTE_ORDER_MNP_SELECT_REASON_PAGE]);
      })
      .then(() => {
        this.pageLoadingService.closeLoading();
      });

  }
  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }

  private createTransaction(): void {
    this.transaction = {
      data: {
        transactionType: TransactionType.ORDER_MNP,
        action: null,
      }
    };
  }
}
