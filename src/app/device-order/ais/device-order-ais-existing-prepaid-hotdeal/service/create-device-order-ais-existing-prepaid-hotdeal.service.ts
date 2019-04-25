import { Injectable } from '@angular/core';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Transaction } from 'src/app/shared/models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class CreateDeviceOrderAisExistingPrepaidHotdealService {

  priceOption: PriceOption;
  transaction: Transaction;

  constructor() { }
}
