import { Injectable } from '@angular/core';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { User, TokenService, AlertService } from 'mychannel-shared-libs';

@Injectable({
  providedIn: 'root'
})
export class RemoveCartService {

  user: User;
  constructor(private http: HttpClient,
              private tokenService: TokenService,
              private transactionService: TransactionService,
              private alertService: AlertService) {
                this.user = this.tokenService.getUser();
              }

  removeCartDT( transaction: Transaction): Promise<any> {
    return this.http.post('/api/salesportal/dt/remove-cart', {
      soId: transaction.data.order.soId,
      userId: this.user.username
    }).toPromise();
  }

  returnStock(transaction: Transaction): Promise<void> {
    return new Promise(resolve => {
      const promiseAll = [];
      if (transaction.data) {
        if (transaction.data.order && transaction.data.order.soId) {
          const order = this.removeCartDT(transaction).catch(() => Promise.resolve());
          promiseAll.push(order);
        }
      }
      Promise.all(promiseAll).then(() => resolve());
    });
  }

  backToReturnStock(url: string, transaction: Transaction): void {
    if (transaction && transaction.data && transaction.data.order && transaction.data.order.soId) {
      this.alertService.question('ต้องการยกเลิกรายการขายหรือไม่ การยกเลิก ระบบจะคืนสินค้าเข้าสต๊อคสาขาทันที', 'ตกลง', 'ยกเลิก')
        .then((response: any) => {
          if (response.value === true) {
            this.onUnlockMobileNo(transaction.data.simCard.mobileNo);
            this.returnStock( transaction).then(() => {
              this.transactionService.remove();
              window.location.href = url;
            });
          }
        });
    } else {
      this.transactionService.remove();
      window.location.href = url;
    }
  }

  onUnlockMobileNo(mobileNo: string): Promise<any> {
    return this.http.post('/api/customerportal/newRegister/selectMobileNumberRandom', {
      userId: this.user.username,
      mobileNo: mobileNo,
      action: 'Unlock'
    }).toPromise();
  }
}
