import { Injectable } from '@angular/core';
import { API } from '../constants/api.constant';
import { HttpClient } from '@angular/common/http';
import { Customer, BillDeliveryAddress } from 'src/app/shared/models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerInformationService {

  constructor(
    private http: HttpClient
  ) { }

  getBillingByIdCard(idCardNo: string): Promise<any> {
    const getBillingAccountAPI = `/api/customerportal/newRegister/${idCardNo}/queryBillingAccount`;
    return this.http.get(getBillingAccountAPI).toPromise();
  }

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

  convertBillingAddressToString(billDeliveryAddress: BillDeliveryAddress): string {
    let str: string = '';
    for (const item in billDeliveryAddress) {
      if (billDeliveryAddress.hasOwnProperty(item)) {
        str += ' ' + billDeliveryAddress[item];
      }
    }
    return str;
  }

}
