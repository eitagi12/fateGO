import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription, Observable } from 'rxjs';
import { API } from '../constants/api.constant';
import { TokenService } from 'mychannel-shared-libs';

@Injectable({
  providedIn: 'root'
})
export class BillingAddressService {

  constructor(
    private http: HttpClient,
    private tokenService: TokenService) {}
  getLocationName(): Observable<any> {
      const locationCode = this.tokenService.getUser().locationCode;
      // const locationCodeAPI = API.QUERY_LOCATIONNAME + '?code=' + locationCode;
      console.log(locationCode);
      // console.log('api', locationCodeAPI);
      return this.http.get(API.QUERY_LOCATIONNAME, {
        params: {
          code: locationCode
        }
      });
    }
  getTitleName(): Promise<Object> {
    return this.http.get(API.QUERY_TITLENAMES).toPromise().then(this.responseTitleName());
  }

  getProvinces(): Promise<string[]> {
    return this.http.get(API.GET_ALL_PROVINCES).toPromise().then(this.sortProvincesName());
  }

  getZipCodes(): Promise<string[]> {
    return this.http.get(API.GET_ALL_ZIP_CODES).toPromise().then(this.responseZipCodes());
  }

  getAmphurs(req: any): Promise<string[]> {
    return this.http.get(API.QUERY_AMPHURS, {params: req}).toPromise().then(this.responseAmphurs());
  }

  getTumbols(req: any): Promise<string[]> {
    return this.http.get(API.QUERY_TUMBOLS, {params: req}).toPromise().then(this.responseTumbols());
  }

  queryZipCode(req: any): Promise<any> {
    return this.http.get(API.QUERY_ZIPCODE, { params: req }).toPromise().then(this.responseZipCode());
  }

  getProvinceIdByZipCode(zipCode: string): Promise<any> {
    return this.http.get(API.GET_PROVINCE_BY_ZIP_CODE, {params: { zipcode: zipCode }}).toPromise().then(this.responseProvinceID());
  }

  private responseTitleName(): (value: Object) => any {
    return (resp: any) => resp.data.titleNames || [];
  }

  private responseProvinceID(): (value: Object) => any {
    return (resp: any) => resp.data.provinceId || null;
  }

  private responseZipCode(): (value: Object) => any {
    return (resp: any) => resp.data.zipcodes || [];
  }

  private responseTumbols(): (value: Object) => any {
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

  private responseAmphurs(): (value: Object) => any {
    return (resp: any) => resp.data.amphurs || [];
  }
}
