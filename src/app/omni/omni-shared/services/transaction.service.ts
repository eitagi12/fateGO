import { Injectable } from '@angular/core';
import { LocalStorageService, NgxResource } from 'ngx-store';
import { TokenService, User } from 'mychannel-shared-libs';
import * as moment from 'moment';
import { Transaction } from '../models/transaction.model';

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

  remove(): void {
    this.settings.remove();
  }

  save(transaction: Transaction): void {
    this.settings.save(transaction);
  }

  update(transaction: Partial<Transaction>): void {
    this.remove();
    this.settings.update(transaction);
  }

  load(): Transaction {
    return this.settings.value;
  }
}
