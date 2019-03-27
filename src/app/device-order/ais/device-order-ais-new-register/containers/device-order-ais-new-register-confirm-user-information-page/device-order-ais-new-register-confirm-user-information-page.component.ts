import { Component, OnInit } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Router } from '@angular/router';
import { HomeService } from 'mychannel-shared-libs';
import {
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_SELECT_PACKAGE_PAGE,
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_MOBILE_CARE_PAGE,
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_EDIT_BILLING_ADDRESS_PAGE
} from 'src/app/device-order/ais/device-order-ais-new-register/constants/route-path.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ConfirmCustomerInfo } from 'mychannel-shared-libs';

@Component({
  selector: 'app-device-order-ais-new-register-confirm-user-information-page',
  templateUrl: './device-order-ais-new-register-confirm-user-information-page.component.html',
  styleUrls: ['./device-order-ais-new-register-confirm-user-information-page.component.scss']
})
export class DeviceOrderAisNewRegisterConfirmUserInformationPageComponent implements OnInit {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;

  transaction: Transaction;
  confirmCustomerInfo: ConfirmCustomerInfo;

  isTelNoBillingValid: boolean;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    const customer = this.transaction.data.customer;
    const mainPackage = this.transaction.data.mainPackage;
    this.confirmCustomerInfo = {
      titleName: customer.titleName,
      firstName: customer.firstName,
      lastName: customer.lastName,
      idCardNo: customer.idCardNo,
      mobileNo: customer.mainMobile,
      mainPackage: mainPackage['title'],
      onTopPackage: '',
      packageDetail: mainPackage['detailTH'],
    };
  }

  onTelNoBillingCompleted(event: any): void {
    console.log('onTelNoBillingCompleted ', event);
  }

  onTelNoBillingError(valid: boolean): void {
    console.log('onTelNoBillingError ', valid);
    this.isTelNoBillingValid = valid;
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_SELECT_PACKAGE_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_MOBILE_CARE_PAGE]);
  }

  onEditAddress(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_EDIT_BILLING_ADDRESS_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  isNext(): boolean {
    return this.isTelNoBillingValid;
  }

}
