import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, AlertService, PageLoadingService } from 'mychannel-shared-libs';
import { ROUTE_ORDER_BLOCK_CHAIN_VALIDATE_CUSTOMER_ID_CARD_PAGE, ROUTE_ORDER_BLOCK_CHAIN_LOW_PAGE } from 'src/app/order/order-blcok-chain/constants/route-path.constant';
import { HttpClient } from '@angular/common/http';
import { WIZARD_ORDER_BLOCK_CHAIN } from 'src/app/order/constants/wizard.constant';
import { Transaction, BillingAccount } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import * as moment from 'moment';
const Moment = moment;

interface EligibleMobile {
  mobileNo: string;
  mobileStatus: 'Active' | 'Suspended' | 'Enroll';
  forceEnrollFlag: 'Y' | 'N';
}

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
    private alertService: AlertService,
    private transactionService: TransactionService,
    private pageLoadingService: PageLoadingService,
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    if (this.transaction.data.customer) {
      const idCardNo: string = this.transaction.data.customer.idCardNo;
      this.callServices(idCardNo);
    } else {
      this.onBack();
    }
  }

  callServices(idCardNo: string): void {
    this.http.get(`/api/customerportal/newRegister/${idCardNo}/queryPrepaidMobileList/blockchain`).toPromise()
      .then((resp: any) => this.mappingMobileList(resp))
      .catch(() => [])
      .then(mobileList => this.callGetMobileIdService(mobileList, idCardNo));
  }

  callGetMobileIdService(mobileList: any[], idCardNo: string): void {
    this.http.get(`/api/customerportal/newRegister/get-mobile-id/${idCardNo}`).toPromise()
      .then((res: any = {}) => {
        const result = (res.data || {}).resultData || [];
        return result
          .filter((mobile: any = {}) => (mobile.mobile_id_status || [])
            .some((arr: any = {}) => arr.status === 'A'))
          .map((arr: any = {}) => arr.msisdn.replace(/(^66)/, '0'));
      }).catch(() => [])
      .then((result: Array<any> = []) => this.mapPrepaidMobileNo(mobileList, result));
  }

  mappingMobileList(resp: any): any[] {
    const respMobileList = [...resp.data.prepaidMobileList || {}, ...resp.data.postpaidMobileList || {}] || [];
    const mobileList = respMobileList.filter((order: any) => {
      return ['Submit for Approve', 'Pendingx', 'Submitted', 'Request',
        'Saveteam', 'QueryBalance', 'Response', 'Notification', 'BAR Processing',
        'BAR', 'Terminating'].find((statusCode: any) => {
          return statusCode !== order.statusCode;
        });
    }) || [];
    return mobileList;
  }

  mapPrepaidMobileNo(mobileList: any, blockChainMobileNo: Array<any> = []): void {
    const mobiles: Array<EligibleMobile> = new Array<EligibleMobile>();
    mobileList.forEach(mobileElement => {
      if (blockChainMobileNo.includes(mobileElement.mobileNo)) {
        mobileElement.status += ' (สมัครแทนบัตรแล้ว)';
        mobileElement.forceEnrollFlag = 'Y';
      }
      mobiles.push({
        mobileNo: mobileElement.mobileNo,
        mobileStatus: mobileElement.status,
        forceEnrollFlag: mobileElement.forceEnrollFlag || 'N'
      });
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
    const mobileNo = this.selectMobileNo.mobileNo;
    this.http.get(`/api/customerportal/mobile-detail/${mobileNo}`).toPromise()
      .then((resp: any) => {
        const respSim = resp && resp ? resp.data : '';
        if (respSim.registerDate) {
          const registerDate = moment(respSim.registerDate, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DDTHH:mm:ss');
          this.saveData(registerDate);
        } else {
          // tslint:disable-next-line:max-line-length
          this.alertService.error(`หมายเลข ${mobileNo} มีการยืนยันตัวตนไม่สมบูรณ์ กรุณายืนยันตัวตนอีกครั้ง`);
        }
      }).catch(() => {
        this.alertService.error(`หมายเลข ${mobileNo} ไม่สามารถสมัครบริการแทนบัตรได้ในขณะนี้ กรุณาทำรายการใหม่ภายหลัง`);
      });

  }

  saveData(registerDate: any): void {
    this.transaction.data.simCard = {
      mobileNo: this.selectMobileNo.mobileNo,
      persoSim: false,
      forceEnrollFlag: this.selectMobileNo.forceEnrollFlag,
      registerDate: registerDate
    };
    if (this.selectMobileNo.forceEnrollFlag === 'Y') {
      // tslint:disable-next-line:max-line-length
      this.alertService.question(`หมายเลข ${this.selectMobileNo.mobileNo} เคยสมัครแทนบัตรแล้ว <br>กรุณายืนยันการสมัครใหม่อีกครั้ง`, 'ตกลง', 'ยกเลิก')
        .then((data: any) => {
          if (data.value) {
            this.router.navigate([ROUTE_ORDER_BLOCK_CHAIN_LOW_PAGE]);
          }
          return;
        });
    } else {
      this.router.navigate([ROUTE_ORDER_BLOCK_CHAIN_LOW_PAGE]);
    }
  }
  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}
