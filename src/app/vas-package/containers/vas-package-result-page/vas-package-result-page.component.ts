import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, PageLoadingService, AlertService, TokenService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ROUTE_VAS_PACKAGE_CURRENT_BALANCE_PAGE, ROUTE_VAS_PACKAGE_SELECT_PACKAGE_PAGE, ROUTE_VAS_PACKAGE_MENU_VAS_ROM_PAGE } from 'src/app/vas-package/constants/route-path.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { HttpClient } from '@angular/common/http';
declare let window: any;
@Component({
  selector: 'app-vas-package-result-page',
  templateUrl: './vas-package-result-page.component.html',
  styleUrls: ['./vas-package-result-page.component.scss']
})
export class VasPackageResultPageComponent implements OnInit {

  public transaction: Transaction;
  public mobileNo: any;
  public success: boolean;
  public isRomAgent: boolean;
  public mobileNoAgent: string;
  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private pageLoadingService: PageLoadingService,
    private alertService: AlertService,
    private http: HttpClient,
    private tokenService: TokenService,
  ) {
    this.transaction = this.transactionService.load();
    this.mobileNo = this.transaction.data.simCard.mobileNo;
    this.mobileNoAgent = this.transaction && this.transaction.data && this.transaction.data.romAgent
      && this.transaction.data.romAgent.mobileNoAgent ? this.transaction.data.romAgent.mobileNoAgent : '';
  }

  ngOnInit(): void {
    this.checkTransactionType() ? this.createPackRomAgent() : this.createPackCustomer();
  }

  public checkTransactionType(): any {
    if (this.transaction.data.transactionType === 'RomAgent') {
      return true;
    } else {
      return false;
    }
  }

  createPackCustomer(): void {
    this.pageLoadingService.openLoading();
    const requestCreateVasPack: any = {
      msisdn: `66${this.mobileNo.substring(1, this.mobileNo.length)}`,
      accessNum: this.transaction.data.onTopPackage.customAttributes.access_num,
      packId: this.transaction.data.onTopPackage.customAttributes.pack_id,
      ascCode: this.tokenService.getUser().ascCode || '',
      destinationServer: this.transaction.data.onTopPackage.customAttributes.destination_server,
    };
    this.http.post(`/api/customerportal/changepromotion/changepro`, requestCreateVasPack).toPromise()
      .then((resp: any) => {
        if (resp.data.STATUS === 'OK') {
          this.success = true;
          this.pageLoadingService.closeLoading();
        } else {
          this.success = false;
          this.pageLoadingService.closeLoading();
        }
      })
      .catch((error) => {
        this.success = false;
        this.pageLoadingService.closeLoading();
      });
  }

  createPackRomAgent(): void {
    this.pageLoadingService.openLoading();
    const packId = this.transaction.data.onTopPackage.customAttributes.pack_id;
    const Pin = this.transaction.data.romAgent.pinAgent;
    const requestVasPackage = {
      ssid: this.transaction.transactionId,
      msisdn: `66${this.mobileNoAgent.substring(1, this.mobileNoAgent.length)}`,
      imsi: '520036001697648',
      vlr: 'EASYAPP',
      shortcode: '*226',
      serviceNumber: '*226',
      menuLevel: `*${Pin}*${this.mobileNo}*${packId}`,
      cos: '600001',
      spName: 'awn',
      brandId: '4',
      language: '1',
      mobileLocation: '3OCCB502',
      customerState: '1',
      servicePackageId: '6',
    };
    this.http.post('api/customerportal/rom/vas-package', requestVasPackage).toPromise()
      .then((res: any) => {
        if (res.data.status === '0000001') {
          this.success = true;
          this.pageLoadingService.closeLoading();
        } else {
          this.success = false;
          this.pageLoadingService.closeLoading();
        }
      })
      .catch((err) => {
        this.success = false;
        this.alertService.error(err);
        this.pageLoadingService.closeLoading();
      });
  }

  onMainMenu(): void {
    if (window.aisNative) {
      window.aisNative.onAppBack();
    } else {
      window.webkit.messageHandlers.onAppBack.postMessage('');
    }
  }

  onTopUp(): void {
    window.location.href = `/easyapp/top-up?mobileNo=${this.mobileNo}`;
  }

  onSelectPackage(): void {
    this.router.navigate([ROUTE_VAS_PACKAGE_MENU_VAS_ROM_PAGE], { queryParams: this.mobileNo });
  }
}
