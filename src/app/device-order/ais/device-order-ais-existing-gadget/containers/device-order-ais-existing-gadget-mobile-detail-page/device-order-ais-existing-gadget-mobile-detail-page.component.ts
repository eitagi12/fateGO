import { Component, OnInit } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Transaction, TransactionAction } from 'src/app/shared/models/transaction.model';
import { MobileInfo, ShoppingCart, HomeService, PageLoadingService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';

@Component({
  selector: 'app-device-order-ais-existing-gadget-mobile-detail-page',
  templateUrl: './device-order-ais-existing-gadget-mobile-detail-page.component.html',
  styleUrls: ['./device-order-ais-existing-gadget-mobile-detail-page.component.scss']
})
export class DeviceOrderAisExistingGadgetMobileDetailPageComponent implements OnInit {

  wizards: any = WIZARD_DEVICE_ORDER_AIS;
  transaction: Transaction;
  mobileInfo: MobileInfo;
  shoppingCart: ShoppingCart;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private http: HttpClient,
    private shoppingCartService: ShoppingCartService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    if (this.transaction.data.action === TransactionAction.KEY_IN
      || this.transaction.data.action === TransactionAction.READ_CARD) {
        this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    }
    this.getMobileInfo();
  }

  getMobileInfo(): void {
    this.pageLoadingService.openLoading();
    // const mobileNo = this.transaction.data.simCard.mobileNo;
    const mobileNo = '';
      this.mobileInfo = {
        mobileNo: mobileNo,
        chargeType: 'รายเดือน',
        status: 'Active',
        sagment: 'Classic',
        serviceYear: '1 ปี 2 เดือน ',
        mainPackage: 'HomeBROADBAND Package 50/20 Mbps 599 THB'
      };
      this.transaction.data.simCard.chargeType = null;
      this.transaction.data.simCard.billingSystem = 'IRB';
      this.pageLoadingService.closeLoading();
  }

  onHome(): void {
    this.homeService.goToHome();
  }
}
