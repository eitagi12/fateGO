import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { ApiRequestService, PageLoadingService, HomeService, ReadCardProfile, User, AlertService, ValidateCustomerIdCardComponent } from 'mychannel-shared-libs';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CUSTOMER_INFO_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_VALIDATE_CUSTOMER_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_VALIDATE_CUSTOMER_REPI_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CUSTOMER_PROFILE_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/constants/route-path.constant';
import { Transaction, TransactionAction, Customer, BillDeliveryAddress } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-validate-customer-id-card-page',
  templateUrl: './device-order-ais-existing-best-buy-validate-customer-id-card-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-validate-customer-id-card-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyValidateCustomerIdCardPageComponent implements OnInit, OnDestroy {

  kioskApi: boolean;

  transaction: Transaction;
  profile: ReadCardProfile;
  zipcode: string;
  readCardValid: boolean;
  priceOption: PriceOption;
  user: User;
  billDeliveryAddress: BillDeliveryAddress;

  @ViewChild(ValidateCustomerIdCardComponent)
  validateCustomerIdcard: ValidateCustomerIdCardComponent;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private apiRequestService: ApiRequestService,
    private alertService: AlertService,
    private http: HttpClient
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
  }

  onError(valid: boolean): void {
    this.readCardValid = valid;
    if (!this.profile) {
      this.alertService.error('ไม่สามารถอ่านบัตรประชาชนได้ กรุณาติดต่อพนักงาน');
      this.validateCustomerIdcard.koiskApiFn.removedState().subscribe((removed: boolean) => {
        if (removed) {
          this.validateCustomerIdcard.ngOnDestroy();
          this.validateCustomerIdcard.ngOnInit();
        }
      });

    }
  }

  onCompleted(profile: ReadCardProfile): void {
    this.profile = profile;
    // auto next
    this.onNext();
  }

  onNext(): void {
    const action = this.transaction.data.action;
    this.http.get(`/api/customerportal/newRegister/${this.profile.idCardNo}/queryCustomerInfo`)
    .toPromise()
    .then(() => {
      if (action === TransactionAction.KEY_IN || action === TransactionAction.READ_CARD) {
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CUSTOMER_INFO_PAGE]);
      } else {
        const mobileNo = this.transaction.data.simCard.mobileNo;
        this.http.get(`/api/customerportal/newRegister/verifyPrepaidIdent?idCard=${this.profile.idCardNo}&mobileNo=${mobileNo}`)
          .toPromise()
          .then((respPrepaidIdent: any) => {
            if (respPrepaidIdent.data && respPrepaidIdent.data.success) {
              this.transaction.data.action = TransactionAction.KEY_IN;
              this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CUSTOMER_INFO_PAGE]);
            } else {
              this.transaction.data.action = TransactionAction.KEY_IN_REPI;
              this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CUSTOMER_PROFILE_PAGE]);
            }
          });
      }
    });
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): void {
    const action = this.transaction.data.action;
    if (action === TransactionAction.KEY_IN || action === TransactionAction.READ_CARD) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_VALIDATE_CUSTOMER_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_VALIDATE_CUSTOMER_REPI_PAGE]);
    }
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}
