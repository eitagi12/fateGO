import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenService } from 'mychannel-shared-libs';

@Injectable({
  providedIn: 'root'
})
export class BanksPromotionService {

  constructor( private http: HttpClient
  ) { }

  getBanksPromotion(locationCode: string): Promise<any> {
    return  this.http.post('/api/salesportal/banks-promotion', { locationCode }).toPromise();
  }
}
