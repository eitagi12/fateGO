import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService, NgxResource } from 'ngx-store';
import { TokenService } from 'mychannel-shared-libs';
import { Tradein, Criteriatradein } from 'src/app/shared/models/trade-in.model';


@Injectable({
  providedIn: 'root'
})
export class TradeInService {
  constructor(private http: HttpClient,
              private localStorageService: LocalStorageService,
              private tokenService: TokenService) { }


  private get settingTradein(): NgxResource<object> {
    console.log('localStorageService', this.localStorageService);
    return this.localStorageService
      .load(`Tradein`)
      .setDefaultValue({});
  }

  private get settingCriteriatTradein(): NgxResource<object> {
    console.log('localStorageService', this.localStorageService);
    return this.localStorageService
      .load(`Criteriatradein`)
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

  getListValuationTradein(brand: string, model: string): Observable<any> {
    const url = '/api/salesportal/getListValuationTradein';
    const body = {
      brand: brand,
      model: model
    };
    return this.http.post(url, body);
  }

  getEstimateTradein(objEstimate: any, aisFlg: string): Observable<any> {
    const url = '/api/salesportal/getEstimateTradein';
    const token = this.tokenService.getUser();
    const body = {
      locationCode: token.locationCode,
      userId: token.username,
      brand: objEstimate.brand,
      model: objEstimate.model,
      matCode: objEstimate.matCode,
      serialNo: objEstimate.serialNo,
      aisFlg: aisFlg,
      listValuation: objEstimate.listValuationTradein
    };
    return this.http.post(url, body);
  }

  setSelectedTradein(objTradein: Tradein) {
    this.settingTradein.save(objTradein);
  }

  removeTradein () {
    this.settingTradein.remove();
    this.settingCriteriatTradein.remove();
  }

  getTradein () {
    return this.settingTradein.value;
  }

  setValuationlistTradein(valuationlists: Criteriatradein) {
    this.settingCriteriatTradein.save(valuationlists);
  }

  setEstimateTradein(objEstimate: object) {
    this.settingCriteriatTradein.update(objEstimate);
  }
}
