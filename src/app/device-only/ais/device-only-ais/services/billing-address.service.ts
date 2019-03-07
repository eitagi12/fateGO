import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BillingAddressService {

  constructor(private http: HttpClient) { }

  getZipCode(): Promise<string> {
    return this.http.get('/api/customerportal/newRegister/getAllProvinces').toPromise()
      .then((resp: any) => {
        return resp;
      });
  }
}
