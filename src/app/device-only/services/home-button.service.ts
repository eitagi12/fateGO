import { Injectable } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { HomeService, AlertService, TokenService } from 'mychannel-shared-libs';
import { CreateOrderService } from './create-order.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class HomeButtonService {

  transaction: Transaction;
  user: any;

  constructor(
    private homeService: HomeService,
    private alertService: AlertService,
    private createOrderService: CreateOrderService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private tokenService: TokenService,
  ) {
    this.transaction = this.transactionService.load();
    this.user = this.tokenService.getUser();
  }

  initEventButtonHome(): void {
    this.homeService.callback = () => {
      this.alertService.question('ต้องการยกเลิกรายการขายหรือไม่ การยกเลิก ระบบจะคืนสินค้าเข้าสต๊อคสาขาทันที', 'ตกลง', 'ยกเลิก')
        .then((response: any) => {
          if (response.value === true) {
            this.createOrderService.cancelOrder(this.transaction).then((isSuccess: any) => {
              // this.transactionService.remove();
              // this.priceOptionService.remove();
              if (this.user.userType === 'ASP') {
                console.log('asp');
              } else {
                // window.location.href = '/';
                console.log('ssza');

              }
            });
          }
        }).catch(() => {
          this.transactionService.remove();
          this.priceOptionService.remove();
          if (this.user.userType === 'ASP') {
            window.location.href = environment.AUTH_URL;
          } else {
            window.location.href = '/';
          }
        });
    };
  }

}
