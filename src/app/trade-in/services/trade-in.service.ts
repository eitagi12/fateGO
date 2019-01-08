import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService, NgxResource } from 'ngx-store';
import { Tradein } from '../models/trade-in.models';
import { TokenService } from 'mychannel-shared-libs';


@Injectable({
  providedIn: 'root'
})
export class TradeInService {
  constructor(private http: HttpClient,
              private localStorageService: LocalStorageService,
              private tokenService: TokenService) { }


  private get settingTradein(): NgxResource<object> {
    return this.localStorageService
      .load(`Tradein`)
      .setDefaultValue({});
  }

  getListModelTradeIn(): Observable<any> {
    const url = '/api/salesportal/getlistmodeltradein';
    return this.http.get(url);
  }

  checkSerialTradein(imei: string): Observable<any> {
    const token = this.tokenService.getUser();
    const url = '/api/customerportal/newRegister/checkSerial';
    const body = {
      imei: imei,
      locationCode: token.locationCode,
      checkType: 'TRADEIN'
    };
    return this.http.post(url, body);
  }

  setSelectedTradein(objTradein: Tradein) {
    this.settingTradein.save(objTradein);
  }

  removeTradein () {
    this.settingTradein.remove();
  }

  getTradein () {
    return this.settingTradein.value;
  }
}
