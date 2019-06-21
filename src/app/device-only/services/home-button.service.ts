import { Injectable } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { HomeService, AlertService, User, TokenService } from 'mychannel-shared-libs';
import { CreateOrderService } from './create-order.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
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
  ) {
    this.user = this.tokenService.getUser();
  }

  initEventButtonHome(): void {
    this.homeService.callback = () => {
      this.alertService.question('ต้องการยกเลิกรายการขายหรือไม่ การยกเลิก ระบบจะคืนสินค้าเข้าสต๊อคสาขาทันที', 'ตกลง', 'ยกเลิก')
        .then((response: any) => {
          console.log(response);
          if (response.value === true) {
            this.createOrderService.cancelOrder(this.transaction).then((isSuccess: any) => {
              console.log('isSuccess', isSuccess);
              console.log('localtioncode', this.user.locationCode);
              this.transactionService.remove();
              this.priceOptionService.remove();
              if (this.user.locationCode === '1213') {
                window.location.href = '/smart-digital/main-menu';
              } else {
                window.location.href = '/';
              }
            });
          }
        }).catch((err: any) => {
          console.log('err', err);
          this.transactionService.remove();
          this.priceOptionService.remove();
          window.location.href = '/';
        });
    };
  }

}
