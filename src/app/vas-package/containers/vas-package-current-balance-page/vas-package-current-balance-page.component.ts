import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, REGEX_MOBILE, PageLoadingService, TokenService } from 'mychannel-shared-libs';
import { ROUTE_VAS_PACKAGE_OTP_PAGE, ROUTE_VAS_PACKAGE_RESULT_PAGE } from 'src/app/vas-package/constants/route-path.constant';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
const Moment = moment;
@Component({
  selector: 'app-vas-package-current-balance-page',
  templateUrl: './vas-package-current-balance-page.component.html',
  styleUrls: ['./vas-package-current-balance-page.component.scss']
})
export class VasPackageCurrentBalancePageComponent implements OnInit {

  romAgentForm: FormGroup;
  transaction: Transaction;
  balance: string;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private pageLoadingService: PageLoadingService,
    private http: HttpClient,
    private tokenService: TokenService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.createForm();
    this.callService();
  }

  createForm(): void {
    this.romAgentForm = this.fb.group({
      'mobileNo': [{ value: '0927095833', disabled: true }, Validators.compose([Validators.required, Validators.pattern(REGEX_MOBILE)])],
      'amount': [{ value: this.balance, disabled: true }, Validators.compose([Validators.required])],
    });
    this.romAgentForm.patchValue({
      mobileNo: '0927095833',
      amount: this.balance,
    });
  }

  callService(): void {
    this.pageLoadingService.openLoading();
    const token = this.tokenService.getAccessToken();
    this.http.post('api/customerportal/rom/get-main', {
      transactionid: this.transaction.transactionId,
      agent_id: '6240014',
      mobile_no: '0927095833',
      // tslint:disable-next-line:max-line-length
      header: 'Bearer' + ' ' + token
    }).toPromise().then((data: any) => {
      const currntBalance: any = data && data.balance ? data.balance : '-';
      this.balance = currntBalance;
    }).then(() => {
      this.pageLoadingService.closeLoading();
    });
  }

  onBack(): void {
    this.router.navigate([ROUTE_VAS_PACKAGE_OTP_PAGE]);
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    const token = this.tokenService.getAccessToken();
    const mobileNO = '0927095833';
    this.http.post('api/customerportal/rom/vas-package', {
      ssid: this.transaction.transactionId,
      msisdn: `66${mobileNO.substring(1, mobileNO.length)}`,
      imsi: '520036001697648',
      vlr: '66923011104',
      shortcode: '*226',
      serviceNumber: '*226',
      menuLevel: '7337',
      cos: '600001',
      spName: 'awn',
      brandId: '4',
      language: '1',
      mobileLocation: '3OCCB502',
      customerState: '1',
      servicePackageId: '6',
    }).toPromise().then((data: any) => {

    }).then(() => {
      this.pageLoadingService.closeLoading();
    });
    this.router.navigate([ROUTE_VAS_PACKAGE_RESULT_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

}
