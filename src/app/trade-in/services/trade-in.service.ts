import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenService } from 'mychannel-shared-libs';

@Injectable({
  providedIn: 'root'
})
export class TradeInService {
  constructor(private http: HttpClient,
              private tokenService: TokenService) { }

  getListModelTradeIn(): Promise<any> {
    const url = '/api/salesportal/getlistmodeltradein';
    return this.http.get(url).toPromise();
  }

  checkSerialTradein(imei: string): Promise<any> {
    const token = this.tokenService.getUser();
    const url = '/api/customerportal/newRegister/checkSerial';
    const body = {
      imei: imei,
      locationCode: token.locationCode,
      checkType: 'TRADEIN'
    };
    return this.http.post(url, body).toPromise();
  }

  getListValuationTradein(brand: string, model: string): Promise<any> {
    const url = '/api/salesportal/getListValuationTradein';
    const body = {
      brand: brand,
      model: model
    };
    return this.http.post(url, body).toPromise();
  }

  getEstimateTradein(objEstimate: any): Promise<any> {
    const url = '/api/salesportal/getEstimateTradein';
    const token = this.tokenService.getUser();
    const body = {
      locationCode: token.locationCode,
      userId: token.username,
      brand: objEstimate.brand,
      model: objEstimate.model,
      matCode: objEstimate.matCode,
      serialNo: objEstimate.serialNo,
      aisFlg: objEstimate.aisFlg,
      listValuation: objEstimate.listValuation
    };
    return this.http.post(url, body).toPromise();
  }
}
