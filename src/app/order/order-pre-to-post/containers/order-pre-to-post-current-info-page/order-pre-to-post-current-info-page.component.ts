import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { PageLoadingService, AlertService } from 'mychannel-shared-libs';

import {
  ROUTE_ORDER_PRE_TO_POST_CUSTOMER_INFO_PAGE,
  ROUTE_ORDER_PRE_TO_POST_ELIGIBLE_MOBILE_PAGE,
  ROUTE_ORDER_PRE_TO_POST_VALIDATE_CUSTOMER_REPI_PAGE,
  ROUTE_ORDER_PRE_TO_POST_VALIDATE_CUSTOMER_ID_CARD_REPI_PAGE,
  ROUTE_ORDER_PRE_TO_POST_VALIDATE_CUSTOMER_PAGE
} from '../../constants/route-path.constant';
import { Transaction, TransactionAction } from 'src/app/shared/models/transaction.model';
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

  isLoad = true;
  mobileNo: string;
  transaction: Transaction;

  modalRef: BsModalRef;
  balance: Balance;

  serviceChange: CurrentServices[];
  serviceAfterChanged: CurrentServices[];

  constructor(
    private router: Router,
    private http: HttpClient,
    private modalService: BsModalService,
    private alertService: AlertService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit() {
    this.mobileNo = this.transaction.data.simCard.mobileNo;

    this.pageLoadingService.openLoading();

    this.http.get(`/api/customerportal/greeting/${this.mobileNo}/profile`).toPromise()
      .then((resp: any) => {
        const profile = resp.data || [];
        return this.http.get(`/api/customerportal/newRegister/${this.mobileNo}/queryBalance`).toPromise();
      }).then((resp: any) => {
        this.balance = resp.data || [];
        return this.http.get(`/api/customerportal/newRegister/${this.mobileNo}/queryCurrentServices`).toPromise();
      }).then((resp: any) => {
        const currentServices = resp.data || [];

        this.serviceChange = currentServices.services.filter(service => service.canTransfer);
        this.serviceAfterChanged = currentServices.services.filter(service => !service.canTransfer);

        this.pageLoadingService.closeLoading();
        this.isLoad = false;
      }).catch((error: any) => {
        this.pageLoadingService.closeLoading();
        this.isLoad = false;
      });
  }

  onBack() {
    const action = this.transaction.data.action;
    if (action === TransactionAction.KEY_IN || action === TransactionAction.READ_CARD || action === TransactionAction.READ_PASSPORT) {
      this.router.navigate([ROUTE_ORDER_PRE_TO_POST_ELIGIBLE_MOBILE_PAGE]);
    } else {
      this.router.navigate([ROUTE_ORDER_PRE_TO_POST_VALIDATE_CUSTOMER_PAGE]);
    }
  }

  onNext() {

    const action = this.transaction.data.action;

    if (action === TransactionAction.KEY_IN || action === TransactionAction.READ_CARD) {

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
          this.alertService.notify({
            type: 'error',
            html: resp.error.resultDescription
          });
        });
    } else {
      this.router.navigate([ROUTE_ORDER_PRE_TO_POST_VALIDATE_CUSTOMER_ID_CARD_REPI_PAGE]);
    }
  }

  openModal(template: any) {
    this.modalRef = this.modalService.show(template);
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}
