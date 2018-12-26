import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TradeInModule } from '../trade-in.module';

@Injectable({
  providedIn: 'root'
})
export class TradeInService {
  private selectedTradein = {
    brand : '',
    model : '',
    matCode: '',
    serialNo: ''
  };
  constructor(private http: HttpClient) { }

  getListModelTradeIn(): Observable<any> {
    const url = '/api/salesportal/getlistmodeltradein';
    return this.http.get(url);
  }

  checkSerialTradein(imei): Observable<any> {
    const url = '/api/customerportal/newRegister/checkSerial';
    const body = {
      imei: imei,
      locationCode: '1100',
      checkType: 'TRADEIN'
    };
    return this.http.post(url, body);
  }

  setSelectedGlobalServiceTradein (brand: string, model: string, matCode: string) {
    this.selectedTradein.brand = brand;
    this.selectedTradein.model = model;
    this.selectedTradein.matCode = matCode;
  }

  getEstimateTradein(): Observable<any> {
    const url = '/api/salesportal/getestimatetradein';
    return this.http.get(url);
  }
}
