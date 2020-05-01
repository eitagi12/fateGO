import { Component, OnInit } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { ShoppingCart, HomeService, AlertService, User, TokenService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_MOBILE_DETAIL_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-gadget/constants/route-path.constant';
import { HttpClient } from '@angular/common/http';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';

@Component({
  selector: 'app-device-order-ais-existing-gadget-non-package-page',
  templateUrl: './device-order-ais-existing-gadget-non-package-page.component.html',
  styleUrls: ['./device-order-ais-existing-gadget-non-package-page.component.scss']
})
export class DeviceOrderAisExistingGadgetNonPackagePageComponent implements OnInit {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;
  transaction: Transaction;
  priceOption: PriceOption;
  shoppingCart: ShoppingCart;
  user: User;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private shoppingCartService: ShoppingCartService,
    private http: HttpClient,
    private alertService: AlertService,
    private tokenService: TokenService,
    private priceOptionService: PriceOptionService,
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.user = this.tokenService.getUser();
    if (this.transaction && this.transaction.data && this.transaction.data.order && this.transaction.data.order.soId) {
      this.homeService.callback = () => {
        this.alertService.question('ต้องการยกเลิกรายการขายหรือไม่ การยกเลิก ระบบจะคืนสินค้าเข้าสต๊อคสาขาทันที', 'ตกลง', 'ยกเลิก')
          .then((response: any) => {
            if (response.value === true) {
              this.returnStock().then(() => {
                this.transaction.data.order = {};
                this.transactionService.remove();
                window.location.href = '/';
              });
            }
          });
      };
    }
  }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_MOBILE_DETAIL_PAGE]);
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
          const order = this.http.post('/api/salesportal/dt/remove-cart', {
            soId: transaction.data.order.soId,
            userId: this.user.username
          }).toPromise().catch(() => Promise.resolve());
          promiseAll.push(order);
        }
      }
      Promise.all(promiseAll).then(() => resolve());
    });
  }
}
