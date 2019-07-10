import { Component, OnInit, OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, EligibleMobile } from 'mychannel-shared-libs';
import { ROUTE_ORDER_BLOCK_CHAIN_VALIDATE_CUSTOMER_ID_CARD_PAGE, ROUTE_ORDER_BLOCK_CHAIN_AGREEMENT_SIGN_PAGE } from 'src/app/order/order-blcok-chain/constants/route-path.constant';
import { HttpClient } from '@angular/common/http';
import { WIZARD_ORDER_BLOCK_CHAIN } from 'src/app/order/constants/wizard.constant';
import { Transaction, BillingAccount } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';

@Component({
  selector: 'app-order-block-chain-eligible-mobile-page',
  templateUrl: './order-block-chain-eligible-mobile-page.component.html',
  styleUrls: ['./order-block-chain-eligible-mobile-page.component.scss']
})
export class OrderBlockChainEligibleMobilePageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_ORDER_BLOCK_CHAIN;
  eligibleMobiles: Array<EligibleMobile>;
  selectMobileNo: EligibleMobile;
  transaction: Transaction;
  billingAccountList: Array<BillingAccount>;
  billingNetExtremeList: Array<BillingAccount>;

  constructor(
    private router: Router,
    private http: HttpClient,
    private homeService: HomeService,
    private transactionService: TransactionService
  ) {
    this.transaction = this.transactionService.load();
   }

  ngOnInit(): void {
    if (this.transaction.data.customer) {
      const idCardNo: string = this.transaction.data.customer.idCardNo;
      this.getMobileList(idCardNo);
    } else {
      this.onBack();
    }
  }

  getMobileList(idCardNo: string = '1100800828728'): void {
    this.http.get(`/api/customerportal/newRegister/${idCardNo}/queryPrepaidMobileList`).toPromise()
      .then((resp: any) => {
        const respMobileList = [ ...resp.data.prepaidMobileList || {}, ...resp.data.postpaidMobileList || {} ] || [];
        const mobileList = respMobileList.filter((order: any) => {
          return ['Submit for Approve', 'Pendingx', 'Submitted', 'Request',
            'Saveteam', 'QueryBalance', 'Response', 'Notification', 'BAR Processing',
            'BAR', 'Terminating'].find((statusCode: any) => {
              return statusCode !== order.statusCode;
            });
        });
        this.mapPrepaidMobileNo(mobileList);
      })
      .catch(() => {
        this.eligibleMobiles = [];
      });
  }

  mapPrepaidMobileNo(mobileList: { forEach: (arg0: (element: any) => void) => void; }): void {
    const mobiles: Array<EligibleMobile> = new Array<EligibleMobile>();
    mobileList.forEach(element => {
      mobiles.push({ mobileNo: element.mobileNo, mobileStatus: element.status });
    });
    this.eligibleMobiles = mobiles;
  }

  onComplete(eligibleMobile: EligibleMobile): void {
    this.selectMobileNo = eligibleMobile;
  }

  onBack(): void {
    this.router.navigate([ROUTE_ORDER_BLOCK_CHAIN_VALIDATE_CUSTOMER_ID_CARD_PAGE]);
  }

  onNext(): void {
    this.transaction.data.simCard = { mobileNo: this.selectMobileNo.mobileNo, persoSim: false };
    this.router.navigate([ROUTE_ORDER_BLOCK_CHAIN_AGREEMENT_SIGN_PAGE]);
  }
  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}
