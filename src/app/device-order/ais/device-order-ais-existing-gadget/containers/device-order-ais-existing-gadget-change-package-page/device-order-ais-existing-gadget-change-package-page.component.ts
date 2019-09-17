import { Component, OnInit } from '@angular/core';

import { ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_VALIDATE_CUSTOMER_PAGE, ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_ELIGIBLE_MOBILE_PAGE, ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_VALIDATE_IDENTIFY_PAGE, ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_MOBILE_DETAIL_PAGE } from '../../constants/route-path.constant';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Transaction, TransactionAction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { ShoppingCart, HomeService, PageLoadingService, AlertService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { CheckChangeServiceService } from 'src/app/device-order/services/check-change-service.service';
import { HttpClient } from '@angular/common/http';
import { PrivilegeService } from 'src/app/device-order/services/privilege.service';

@Component({
  selector: 'app-device-order-ais-existing-gadget-change-package-page',
  templateUrl: './device-order-ais-existing-gadget-change-package-page.component.html',
  styleUrls: ['./device-order-ais-existing-gadget-change-package-page.component.scss']
})
export class DeviceOrderAisExistingGadgetChangePackagePageComponent implements OnInit {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;
  transaction: Transaction;
  priceOption: PriceOption;
  shoppingCart: ShoppingCart;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private shoppingCartService: ShoppingCartService,
    private pageLoadingService: PageLoadingService,
    private alertService: AlertService,
    private checkChangeService: CheckChangeServiceService,
    private http: HttpClient,
    private privilegeService: PrivilegeService,
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.homeService.callback = () => {
      this.alertService.question('ต้องการยกเลิกรายการขายหรือไม่ การยกเลิก ระบบจะคืนสินค้าเข้าสต๊อคสาขาทันที', 'ตกลง', 'ยกเลิก')
        .then((response: any) => {
          if (response.value === true) {
            this.returnStock().then(() => {
              this.transactionService.remove();
              window.location.href = '/';
            });
          }
        });
    };
  }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
  }

  onBack(): void {
    const action = this.transaction.data.action;
    if (action === TransactionAction.KEY_IN_MOBILE_NO) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_VALIDATE_CUSTOMER_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_ELIGIBLE_MOBILE_PAGE]);
    }
  }

  onNext(): void {
    const action = this.transaction.data.action;
    if (action === TransactionAction.KEY_IN_MOBILE_NO) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_VALIDATE_IDENTIFY_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_MOBILE_DETAIL_PAGE]);
    }
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  returnStock(): Promise<void> {
    return new Promise(resolve => {
      const transaction = this.transactionService.load();
      const promiseAll = [];
      if (transaction.data) {
        if (transaction.data.order && transaction.data.order.soId) {
          const order = this.http.post('/api/salesportal/device-sell/item/clear-temp-stock', {
            location: this.priceOption.productStock.location,
            soId: transaction.data.order.soId,
            transactionId: transaction.transactionId
          }).toPromise().catch(() => Promise.resolve());
          promiseAll.push(order);
        }
      }
      Promise.all(promiseAll).then(() => resolve());
    });
  }
}
