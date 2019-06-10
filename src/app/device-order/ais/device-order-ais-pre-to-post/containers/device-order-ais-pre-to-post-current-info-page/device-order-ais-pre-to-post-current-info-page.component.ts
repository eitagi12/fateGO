import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { PageLoadingService, AlertService, HomeService, ShoppingCart } from 'mychannel-shared-libs';

import { WIZARD_DEVICE_ORDER_AIS } from '../../../../constants/wizard.constant';
import {
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_ELIGIBLE_MOBILE_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_VALIDATE_CUSTOMER_ID_CARD_REPI_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_PAYMENT_DETAIL_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_VALIDATE_CUSTOMER_PAGE
} from '../../constants/route-path.constant';
import { Transaction, TransactionAction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';

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
  selector: 'app-device-order-ais-pre-to-post-current-info-page',
  templateUrl: './device-order-ais-pre-to-post-current-info-page.component.html',
  styleUrls: ['./device-order-ais-pre-to-post-current-info-page.component.scss']
})
export class DeviceOrderAisPreToPostCurrentInfoPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;
  isLoad: boolean = true;
  mobileNo: string;
  transaction: Transaction;
  priceOption: PriceOption;
  // shoppingCart: ShoppingCart;

  modalRef: BsModalRef;
  balance: Balance;

  serviceChange: CurrentServices[];
  serviceAfterChanged: CurrentServices[];

  constructor(
    private router: Router,
    private http: HttpClient,
    private modalService: BsModalService,
    private alertService: AlertService,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private shoppingCartService: ShoppingCartService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.mobileNo = this.transaction.data.simCard.mobileNo;

    this.pageLoadingService.openLoading();

    const queryBalancePromise = this.http.get(`/api/customerportal/newRegister/${this.mobileNo}/queryBalance`)
      .toPromise().catch(() => {
        return {};
      });
    const queryCurrentServicesPromise = this.http.get(`/api/customerportal/newRegister/${this.mobileNo}/queryCurrentServices`)
      .toPromise().catch(() => {
        return {};
      });
    Promise.all([queryBalancePromise, queryCurrentServicesPromise]).then((res: any[]) => {
      this.balance = res[0].data || {};
      const currentServices = res[1].data || [];
      this.serviceChange = currentServices.services.filter(service => service.canTransfer);
      this.serviceAfterChanged = currentServices.services.filter(service => !service.canTransfer);
      this.pageLoadingService.closeLoading();
      this.isLoad = false;
    }).catch(() => {
      this.pageLoadingService.closeLoading();
      this.isLoad = false;
    });
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_ELIGIBLE_MOBILE_PAGE]);

    const action = this.transaction.data.action;
    if (action === TransactionAction.KEY_IN || action === TransactionAction.READ_CARD || action === TransactionAction.READ_PASSPORT) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_ELIGIBLE_MOBILE_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_VALIDATE_CUSTOMER_PAGE]);
    }

  }

  onNext(): void {
    const action = this.transaction.data.action;

    if (action === TransactionAction.READ_CARD || action === TransactionAction.READ_PASSPORT) {

      this.pageLoadingService.openLoading();

      this.http.get('/api/customerportal/validate-customer-mobile-no-pre-to-post', {
        params: {
          mobileNo: this.mobileNo
        }
      }).toPromise()
        .then((resp: any) => {
          this.transaction.data.simCard = { mobileNo: this.mobileNo, persoSim: false };
          this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_PAYMENT_DETAIL_PAGE]);
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
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_VALIDATE_CUSTOMER_ID_CARD_REPI_PAGE]);
    }
  }

  openModal(template: any): void {
    this.modalRef = this.modalService.show(template);
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}
