import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BillingAddressService {

  constructor(private http: HttpClient) { }

  getProvinces(): Promise<string[]> {
    return this.http.get('/api/customerportal/newRegister/getAllProvinces').toPromise()
      .then(this.sortProvincesName());
  }

  getZipCodes(): Promise<string[]> {
    return this.http.get('/api/customerportal/newRegister/getAllZipcodes').toPromise()
    .then(this.responseZipCodes());
  }

  getDistrict(req: any): Promise<string[]> {
    return this.http.get('/api/customerportal/newRegister/queryAmphur', {params: req})
    .toPromise()
    .then(this.responseDistrict());
  }

  getSubDistrict(req: any): Promise<string[]> {
    return this.http.get('/api/customerportal/newRegister/queryTumbol', {params: req})
    .toPromise().then(this.responseSubDistrict());
  }

  queryZipCode(req: any): Promise<any> {
    return this.http.get('/api/customerportal/newRegister/queryZipcode', { params: req })
    .toPromise().then(this.responseZipCode());
  }

  private responseZipCode(): (value: Object) => any {
    return (resp: any) => resp.data.zipcodes || [];
  }

  private responseSubDistrict(): (value: Object) => any {
    return (resp: any) => resp.data.tumbols || [];
  }

  private sortProvincesName(): (value: Object) => any {
    return (resp: any) => {
      return (resp.data.provinces.sort((a: {name: number; }, b: { name: number; }) =>
       (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0) || []);
    };
  }

  private responseZipCodes(): (value: Object) => any {
    return (resp: any) => resp.data.zipcodes || [];
  }

  private responseDistrict(): (value: Object) => any {
    return (resp: any) => resp.data.amphurs || [];
  }
}
