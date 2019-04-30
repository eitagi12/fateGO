import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { User, TokenService } from 'mychannel-shared-libs';
import { LocalStorageService, NgxResource } from 'ngx-store';
import { TradeInTranscation } from './models/trade-in-transcation.model';
const Moment = moment;
@Injectable({
  providedIn: 'root'
})

export class TradeInTransactionService {
  private user: User;

  constructor(
    private tokenService: TokenService,
    private localStorageService: LocalStorageService
  ) {
    this.user = this.tokenService.getUser();
  }

  private get settings(): NgxResource<TradeInTranscation> {
    return this.localStorageService
      .load(`transaction`)
      .setDefaultValue({});
  }

  remove(): void {
    this.settings.remove();
  }

  save(transaction: TradeInTranscation): void {
    this.settings.save(Object.assign({
      createDate: Moment().toISOString(),
      createBy: this.user.username
    }, transaction));
  }

  update(transaction: Partial<TradeInTranscation>): void {
    this.remove();
    this.settings.save(Object.assign({
      lastUpdateDate: Moment().toISOString(),
      lastUpdateBy: this.user.username
    }, transaction));
  }

  load(): TradeInTranscation {
    return this.settings.value;
  }
}
