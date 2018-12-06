import { Injectable } from '@angular/core';
import { LocalStorageService, NgxResource } from 'ngx-store';
import { TokenService, User } from 'mychannel-shared-libs';
import * as moment from 'moment';
import { Transaction } from 'src/app/shared/models/transaction.model';

const Moment = moment;
@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private user: User;

  constructor(
    private tokenService: TokenService,
    private localStorageService: LocalStorageService
  ) {
    this.user = this.tokenService.getUser();
  }

  private get settings(): NgxResource<Transaction> {
    return this.localStorageService
      .load(`transaction`)
      .setDefaultValue({});
  }

  remove() {
    this.settings.remove();
  }

  save(transaction: Transaction) {
    this.settings.save(Object.assign({
      createDate: Moment().toISOString(),
      createBy: this.user.username
    }, transaction));
  }

  update(transaction: Partial<Transaction>) {
    this.remove();
    this.settings.save(Object.assign({
      lastUpdateDate: Moment().toISOString(),
      lastUpdateBy: this.user.username
    }, transaction));
  }

  load(): Transaction {
    return this.settings.value;
  }
}
