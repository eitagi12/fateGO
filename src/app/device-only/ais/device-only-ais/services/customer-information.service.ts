import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../constants/api.constant';

@Injectable({
  providedIn: 'root'
})
export class CustomerInformationService {

  constructor(
    private http: HttpClient
  ) { }

  getBillingByMobileNo(mobileNo: string): Promise<any> {
    if (!mobileNo) {
      return Promise.reject('mobile no not found.');
    }
    const getBillingAPI = API.GET_BILLING + `${mobileNo}`;
    return this.http.get(getBillingAPI).toPromise();
  }

}
