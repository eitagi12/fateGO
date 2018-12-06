import { Injectable } from '@angular/core';
import { NgxResource, LocalStorageService } from 'ngx-store';
import { PriceOption } from '../models/price-option.model';

@Injectable({
  providedIn: 'root'
})
export class PriceOptionService {

  constructor(
    private localStorageService: LocalStorageService
  ) { }

  private get settings(): NgxResource<PriceOption> {
    return this.localStorageService
      .load(`priceOption`)
      .setDefaultValue({});
  }

  remove() {
    this.settings.remove();
  }

  save(priceOption: PriceOption) {
    this.settings.save(priceOption);
  }

  update(priceOption: PriceOption) {
    this.settings.update(priceOption);
  }

  load(): PriceOption {
    return this.settings.value;
  }

}
