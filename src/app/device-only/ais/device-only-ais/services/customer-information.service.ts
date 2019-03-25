import { Injectable } from '@angular/core';
import { API } from '../constants/api.constant';
import { HttpClient } from '@angular/common/http';
import { Customer } from 'src/app/shared/models/transaction.model';

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

  mapAttributeFromGetBill(billingAddress: any): Customer {
    const customer: Customer = {
      idCardNo: billingAddress.idCardNo,
      idCardType: billingAddress.idCardType,
      titleName: billingAddress.titleName,
      firstName: billingAddress.firstName,
      lastName: billingAddress.lastName,
      birthdate: '',
      gender: '',
      expireDate: '',
      homeNo: billingAddress.houseNumber,
      moo: billingAddress.moo,
      mooBan: billingAddress.mooban,
      room: billingAddress.room || '',
      floor: billingAddress.floor,
      buildingName: billingAddress.buildingName,
      soi: billingAddress.soi,
      street: billingAddress.streetName,
      province: billingAddress.provinceName,
      amphur: billingAddress.amphur,
      tumbol: billingAddress.tumbol,
      zipCode: billingAddress.portalCode,
    };
    return customer;
  }

}
