import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, REGEX_MOBILE, PageLoadingService, AlertService, TokenService } from 'mychannel-shared-libs';
import { ROUTE_VAS_PACKAGE_RESULT_PAGE } from 'src/app/vas-package/constants/route-path.constant';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction, RomTransaction, VasPackage } from 'src/app/shared/models/transaction.model';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
declare let window: any;
@Component({
  selector: 'app-vas-package-current-balance-page',
  templateUrl: './vas-package-current-balance-page.component.html',
  styleUrls: ['./vas-package-current-balance-page.component.scss']
})
export class VasPackageCurrentBalancePageComponent implements OnInit, OnDestroy {

  romAgentForm: FormGroup;
  transaction: Transaction;
  balance: string;
  mobileNoAgent: string;
  agentId: string;
  tokenType: string;
  accessToken: string;
  balanceBuyPackage: boolean;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private pageLoadingService: PageLoadingService,
    private http: HttpClient,
    private alertService: AlertService,
    private tokenService: TokenService
  ) {
    this.transaction = this.transactionService.load();
    this.mobileNoAgent = this.transaction.data.romAgent.mobileNoAgent ? this.transaction.data.romAgent.mobileNoAgent : '';
    this.agentId = this.transaction.data.romAgent.agentId ? this.transaction.data.romAgent.agentId : '';
    this.tokenType = this.transaction.data.romAgent.tokenType ? this.transaction.data.romAgent.tokenType : '';
    this.accessToken = this.transaction.data.romAgent.accessToken ? this.transaction.data.romAgent.accessToken : '';
  }

  ngOnInit(): void {
    this.createForm();
    this.getBalanceRomAgent();
  }

  onBack(): void {
    if (window.aisNative) {
      window.aisNative.onAppBack();
    } else {
      window.webkit.messageHandlers.onAppBack.postMessage('');
    }
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  createForm(): void {
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
    const requestGetMain = {
      transactionid: this.genTransactionId(),
      agent_id: this.agentId,
      mobile_no: this.mobileNoAgent,
      header: this.tokenType + ' ' + this.accessToken
    };
    this.pageLoadingService.openLoading();
    this.http.post('/api/customerportal/rom/get-main', requestGetMain).toPromise()
      .then((res: any) => {
        if (res && res.data.status === 'success') {
          this.transaction.data.romAgent = {
            ...this.transaction.data.romAgent,
            transactionIdRom: res.data.transactionid
          };
          this.balance = res.data.balance ? res.data.balance : '';
          this.romAgentForm.controls.amount.setValue(this.balance);
          this.checkBalanceRomWithPricePackage(this.balance);
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

  checkBalanceRomWithPricePackage(balanceRomAgent: string): void {
    const regularPrice = this.transaction.data.onTopPackage.customAttributes.regular_price;
    const priceRomPackage = regularPrice ? regularPrice : '';
    if (+balanceRomAgent >= +priceRomPackage) {
      this.balanceBuyPackage = true;
    } else {
      this.balanceBuyPackage = false;
    }
  }

  createPackRomAgent(): void {
    this.pageLoadingService.openLoading();
    const packId = this.transaction.data.onTopPackage.customAttributes.pack_id;
    const Pin = this.transaction.data.romAgent.pinAgent;
    const mobileNo = this.transaction.data.simCard.mobileNo;
    const requestVasPackage: VasPackage = {
      ssid: this.transaction.transactionId,
      msisdn: `66${this.mobileNoAgent.substring(1, this.mobileNoAgent.length)}`,
      imsi: '520036001697648',
      vlr: 'EASYAPP',
      shortcode: '*226',
      serviceNumber: '*226',
      menuLevel: `*${Pin}*${mobileNo}*${packId}`,
      cos: '600001',
      spName: 'awn',
      brandId: '4',
      language: '1',
      mobileLocation: '3OCCB502',
      customerState: '1',
      servicePackageId: '6',
    };
    this.http.post('/api/customerportal/rom/vas-package', requestVasPackage).toPromise()
      .then((res: any) => {
        if (res.data.status === '0000001') {
          this.transaction.data.status = {
            code: '008',
            description: 'COMPLETE'
          };
        } else {
          this.transaction.data.status = {
            code: '007',
            description: 'ERROR'
          };
        }
      })
      .catch((err) => {
        this.transaction.data.status = {
          code: '007',
          description: 'ERROR'
        };
      }).then(() => {
        const status = this.transaction.data.status.description;
        this.createRomTransaction(this.transaction, requestVasPackage, status);
      });
  }

  createRomTransaction(transaction: Transaction, vasPackage: VasPackage, status: string): Promise<any> {
    const requestBody = this.mapRequestRomTransaction(transaction, vasPackage, status);
    return this.http.post('/api/customerportal/create-rom-transaction', requestBody)
      .toPromise()
      .then((response: any) => {
        return response;
      }).catch(() => {
        /* */
      }).then(() => {
        this.pageLoadingService.closeLoading();
        this.router.navigate([ROUTE_VAS_PACKAGE_RESULT_PAGE]);
      });
  }

  private mapRequestRomTransaction(transaction: Transaction, vasPackage: VasPackage, status: string): RomTransaction {
    const packId = transaction.data.onTopPackage.customAttributes.pack_id ? transaction.data.onTopPackage.customAttributes.pack_id : '';
    return {
      transactionId: transaction.data.romAgent.transactionIdRom,
      ssid: vasPackage.ssid,
      romNo: this.mobileNoAgent,
      cusMobileNo: transaction.data.simCard.mobileNo,
      price: transaction.data.onTopPackage.customAttributes.regular_price,
      packId: packId,
      username: transaction.data.romAgent.usernameRomAgent,
      locationcode: transaction.data.romAgent.locationCode || this.tokenService.getUser().locationCode,
      transactionType: 'VAS',
      status: status,
      asccode: this.tokenService.getUser().ascCode || '',
      appversion: 'EASYAPP'
    };
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }

}
