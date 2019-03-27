
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {
  HomeService, PageLoadingService, AlertService,
  ApiRequestService, REGEX_MOBILE, KioskControls, ValidateCustomerIdCardComponent
} from 'mychannel-shared-libs';
import {
  ROUTE_ORDER_MNP_SELECT_REASON_PAGE
} from 'src/app/order/order-mnp/constants/route-path.constant';
import { WIZARD_ORDER_MNP } from 'src/app/order/constants/wizard.constant';
import { Transaction, TransactionType } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';

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
    private apiRequestService: ApiRequestService,
  ) {
    this.homeService.callback = () => {
      window.location.href = '/smart-shop';
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
    // New x-api-request-id
    this.apiRequestService.createRequestId();

    this.transaction = {
      data: {
        transactionType: TransactionType.ORDER_MNP,
        action: null,
      }
    };
  }
}
