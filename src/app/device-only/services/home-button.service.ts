import { Injectable } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { HomeService, AlertService } from 'mychannel-shared-libs';
import { CreateOrderService } from './create-order.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
@Injectable({
  providedIn: 'root'
})
export class HomeButtonService {

  transaction: Transaction;

  constructor(
    private homeService: HomeService,
    private alertService: AlertService,
    private createOrderService: CreateOrderService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService
  ) {
    this.transaction = this.transactionService.load();
  }

  initEventButtonHome(): void {
    this.homeService.callback = () => {
      this.alertService.question('ต้องการยกเลิกรายการขายหรือไม่ การยกเลิก ระบบจะคืนสินค้าเข้าสต๊อคสาขาทันที', 'ตกลง', 'ยกเลิก')
        .then((response: any) => {
          if (response.value === true) {
            this.createOrderService.cancelOrder(this.transaction).then((isSuccess: any) => {
              this.transactionService.remove();
              this.priceOptionService.remove();
              window.location.href = '/';
            });
          }
        }).catch((err: any) => {
          this.transactionService.remove();
          this.priceOptionService.remove();
          window.location.href = '/';
        });
    };
  }

}
