import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, REGEX_MOBILE, PageLoadingService, AlertService } from 'mychannel-shared-libs';
import { ROUTE_VAS_PACKAGE_RESULT_PAGE } from 'src/app/vas-package/constants/route-path.constant';
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
  mobileNoAgent: string;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private pageLoadingService: PageLoadingService,
    private http: HttpClient,
    private alertService: AlertService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.createForm();
    this.getBalanceRomAgent();
  }

  onBack(): void {
    window.location.href = '/sales-portal/easyapp/new-vas/packlist';
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  createForm(): void {
    this.mobileNoAgent = this.transaction.data.romAgent.mobileNoAgent;
    this.romAgentForm = this.fb.group({
      'mobileNoAgent': [
        { value: this.mobileNoAgent, disabled: true },
        Validators.compose([Validators.required, Validators.pattern(REGEX_MOBILE)])
      ],
      'amount': [
        { value: this.balance, disabled: true },
        Validators.compose([Validators.required])
      ]
    });
  }

  genTransactionId(): any {
    return moment().format('YYYYMMDDHHmmssSSS');
  }

  getBalanceRomAgent(): void {
    const tokenType = this.transaction.data.romAgent.tokenType;
    const accessToken = this.transaction.data.romAgent.accessToken;
    const requestGetMain = {
      transactionid: this.genTransactionId(),
      agent_id: this.transaction.data.romAgent.agentId,
      mobile_no: this.transaction.data.romAgent.mobileNoAgent,
      header: tokenType + ' ' + accessToken
    };
    this.pageLoadingService.openLoading();
    this.http.post('api/customerportal/rom/get-main', requestGetMain).toPromise()
      .then((res: any) => {
        if (res && res.data.status === 'success') {
          this.balance = res.data.balance ? res.data.balance : '';
          this.pageLoadingService.closeLoading();
        } else {
          this.balance = 'ไม่สามารถแสดงยอดเงินได้';
          this.alertService.error(res.data.message);
        }
      })
      .catch(() => {
        this.balance = 'ไม่สามารถแสดงยอดเงินได้';
        this.pageLoadingService.closeLoading();
      });
  }

  onNext(): void {
    this.router.navigate([ROUTE_VAS_PACKAGE_RESULT_PAGE]);
  }

  // addVasPackageByRomAgent(): void {
  //   this.mobileNoAgent = this.transaction.data.romAgent.mobileNoAgent;
  //   const requestVasPackage = {
  //     ssid: this.genTransactionId(),
  //     msisdn: `66${this.mobileNoAgent.substring(1, this.mobileNoAgent.length)}`,
  //     imsi: '520036001697648',
  //     vlr: '66923011104',
  //     shortcode: '*226',
  //     serviceNumber: '*226',
  //     menuLevel: '*1689*0964220452*260',
  //     cos: '600001',
  //     spName: 'awn',
  //     brandId: '4',
  //     language: '1',
  //     mobileLocation: '3OCCB502',
  //     customerState: '1',
  //     servicePackageId: '6',
  //   };
  //   this.pageLoadingService.openLoading();
  //   this.http.post('api/customerportal/rom/vas-package', requestVasPackage).toPromise()
  //     .then((res: any) => {
  //       this.pageLoadingService.closeLoading();
  //     })
  //     .catch((err) => {
  //       this.alertService.error(err);
  //       this.pageLoadingService.closeLoading();
  //     });
  // }

}
