import { Injectable } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { HomeService, AlertService, User, TokenService } from 'mychannel-shared-libs';
import { CreateOrderService } from './create-order.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class HomeButtonService {

  transaction: Transaction;
  user: User;

  constructor(
    private homeService: HomeService,
    private alertService: AlertService,
    private createOrderService: CreateOrderService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.user = this.tokenService.getUser();
    this.transaction = this.transactionService.load();
  }

  initEventButtonHome(): void {
    this.homeService.callback = () => {
      const url = this.router.url;
      if (url.indexOf('result') !== -1) {
        this.homeHandler();
      } else {
        this.alertService.question('ต้องการยกเลิกรายการขายหรือไม่ การยกเลิก ระบบจะคืนสินค้าเข้าสต๊อคสาขาทันที', 'ตกลง', 'ยกเลิก')
          .then((response: any) => {
            if (response.value === true) {
              this.createOrderService.cancelOrder(this.transaction).then((isSuccess: any) => {
                this.transactionService.remove();
                this.priceOptionService.remove();
                this.homeHandler();
              });
            }
          }).catch((err: any) => {
            this.transactionService.remove();
            this.priceOptionService.remove();
            this.homeHandler();
          });
      }
    };
  }

  homeHandler(): any {
    if (this.user.locationCode === '1213') {
      window.location.href = '/smart-digital/main-menu';
    } else if (this.user.userType === 'ASP') {
      window.location.href = environment.sffHomeUrl;
    } else {
      window.location.href = '/';
    }
  }

}
