import { Injectable } from '@angular/core';
import { API } from 'src/app/device-only/ais/device-only-ais/constants/api.constant';
import { HttpClient } from '@angular/common/http';
import { ShopCheckSeller } from 'src/app/device-only/ais/device-only-ais/models/ShopCheckSeller.model';

@Injectable({
  providedIn: 'root'
})
export class SellerService {

  constructor(
    private http: HttpClient
  ) { }

  checkSeller(sellderId: string): Promise<any> {
    const checkSellerAPI = API.CHECK_SELLER + `${sellderId}`;
    return this.http.get(checkSellerAPI).toPromise();
  }

}
