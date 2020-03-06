import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { PageLoadingService, AlertService, HomeService } from 'mychannel-shared-libs';

import {
  ROUTE_ORDER_PRE_TO_POST_CUSTOMER_INFO_PAGE,
  ROUTE_ORDER_PRE_TO_POST_ELIGIBLE_MOBILE_PAGE,
  ROUTE_ORDER_PRE_TO_POST_VERIFY_DOCUMENT_REPI_PAGE,
  ROUTE_ORDER_PRE_TO_POST_VERIFY_DOCUMENT_PAGE,
} from '../../constants/route-path.constant';
import { Transaction, TransactionAction, HandsetSim5G } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';

export interface Balance {
  remainingBalance: number;
  transferBalance: number;
  validityDate: string;
}
export interface CurrentServices {
  canTransfer: boolean;
  serviceCode: string;
  serviceName: string;
}

@Component({
  selector: 'app-order-pre-to-post-current-info-page',
  templateUrl: './order-pre-to-post-current-info-page.component.html',
  styleUrls: ['./order-pre-to-post-current-info-page.component.scss']
})
export class OrderPreToPostCurrentInfoPageComponent implements OnInit, OnDestroy {

  isLoad: boolean = true;
  mobileNo: string;
  transaction: Transaction;

  modalRef: BsModalRef;
  balance: Balance;

  serviceChange: CurrentServices[];
  serviceAfterChanged: CurrentServices[];

  message5G: string;
  messageVolTE: string;

  constructor(
    private router: Router,
    private http: HttpClient,
    private homeService: HomeService,
    private modalService: BsModalService,
    private alertService: AlertService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.mobileNo = this.transaction.data.simCard.mobileNo;

    this.pageLoadingService.openLoading();

    const getBalancePromise = this.http.get(`/api/customerportal/newRegister/${this.mobileNo}/getBalance`)
      .toPromise().catch(() => {
        return {};
      });
    const queryCurrentServicesPromise = this.http.get(`/api/customerportal/newRegister/${this.mobileNo}/queryCurrentServices`)
      .toPromise().catch(() => {
        return {};
      });
    const queryCheckHandsetSim5G = this.http.post('/api/easyapp/configMC',
      {
        operation: 'query',
        nameconfig: 'showFlow5G'
      }).toPromise().then((repConFig: any) => {
        const dataConfig: any = repConFig.data || {};
        if (dataConfig[0] &&
          dataConfig[0].config &&
          dataConfig[0].config.data[0] &&
          dataConfig[0].config.data[0].status) {
          return this.http.post(`/api/customerportal/check-handset-sim-5G`, {
            cmd: 'CHECK',
            msisdn: this.mobileNo,
            channel: 'WEB'
          }).toPromise().catch((error: any) => {
            const errObj: any = error.error || [];
            return errObj.developerMessage ? errObj.developerMessage : 'ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้';
          });
        } else {
          return '';
        }
      });

    Promise.all([getBalancePromise, queryCurrentServicesPromise, queryCheckHandsetSim5G]).then((res: any[]) => {
      this.balance = res[0].data || {};
      this.balance.remainingBalance = Number(this.balance.remainingBalance) / 100;

      const currentServices = res[1].data || [];
      this.serviceChange = currentServices.services.filter(service => service.canTransfer);
      this.serviceAfterChanged = currentServices.services.filter(service => !service.canTransfer);

      const checkHandsetSim5G: HandsetSim5G = res[2].data || [];
      this.message5G = typeof res[2] === 'string' ? res[2] : checkHandsetSim5G.message5gTh;
      this.messageVolTE = typeof res[2] === 'string' ? res[2] : checkHandsetSim5G.messageVolteTh;
      this.transaction.data.handsetSim5G = checkHandsetSim5G;

      this.pageLoadingService.closeLoading();
      this.isLoad = false;
    }).catch(() => {
      this.pageLoadingService.closeLoading();
      this.isLoad = false;
    });
  }

  onBack(): void {
    const action = this.transaction.data.action;
    if (action === TransactionAction.KEY_IN || action === TransactionAction.READ_CARD || action === TransactionAction.READ_PASSPORT) {
      this.router.navigate([ROUTE_ORDER_PRE_TO_POST_ELIGIBLE_MOBILE_PAGE]);
    } else {
      this.router.navigate([ROUTE_ORDER_PRE_TO_POST_VERIFY_DOCUMENT_PAGE]);
    }
  }

  onNext(): void {

    const action = this.transaction.data.action;

    if (action === TransactionAction.KEY_IN || action === TransactionAction.READ_CARD || action === TransactionAction.READ_PASSPORT) {

      this.pageLoadingService.openLoading();

      this.http.get('/api/customerportal/validate-customer-mobile-no-pre-to-post', {
        params: {
          mobileNo: this.mobileNo
        }
      }).toPromise()
        .then((resp: any) => {

          this.transaction.data.simCard = { mobileNo: this.mobileNo, persoSim: false };
          this.router.navigate([ROUTE_ORDER_PRE_TO_POST_CUSTOMER_INFO_PAGE]);
          this.pageLoadingService.closeLoading();

        })
        .catch((resp: any) => {
          this.pageLoadingService.closeLoading();
          const error = resp.error || [];
          if (error && error.errors && typeof error.errors === 'string') {
            this.alertService.notify({
              type: 'error',
              html: error.errors
            });
          } else {
            Promise.reject(resp);
          }
        });
    } else {
      this.router.navigate([ROUTE_ORDER_PRE_TO_POST_VERIFY_DOCUMENT_REPI_PAGE]);
    }
  }

  openModal(template: any): void {
    this.modalRef = this.modalService.show(template);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}
