import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TradeInModule } from '../trade-in.module';

@Injectable({
  providedIn: 'root'
})
export class TradeInService {

  constructor(private http: HttpClient) { }

  getListModelTradeIn(): Observable<any> {
    const url = '/api/salesportal/getlistmodeltradein';
    return this.http.get(url);
  }
}
