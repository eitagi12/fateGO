import { Injectable } from '@angular/core';
import { API } from '../constants/api.constant';
import { HttpClient } from '@angular/common/http';
import { Customer } from 'src/app/shared/models/transaction.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerInformationService {
  private selectedMobileNo: string;
  public unsubscribe: any;
  public cancelreadcard: Subject<boolean> = new Subject<boolean>();
  public isReadCard: boolean = false;
  constructor(
    private http: HttpClient
  ) { }
  setDisableReadCard(): void {
    this.isReadCard = true;
  }
  unSetDisableReadCard(): void {
    this.isReadCard = false;
  }
  getZipCode(province: string, amphur: string , tumbol: string): Promise<any> {
    province = province.replace(/มหานคร$/, '');
      return this.http.get('/api/customerportal/newRegister/getAllProvinces').toPromise()
      .then((resp: any) => {
          const provinceId = (resp.data.provinces.find((prov: any) => prov.name === province) || {}).id;
          const getZipcodeAPI =
          `/api/customerportal/newRegister/queryZipcode?provinceId=${provinceId}&amphurName=${amphur}&tumbolName=${tumbol}`;
          return this.http.get(getZipcodeAPI).toPromise();
   });
  }
  cancelReadCarad(): void {
    this.cancelreadcard.next(false);
  }
  getBillingByIdCard(idCardNo: string): Promise<any> {
    const getBillingAccountAPI = `/api/customerportal/newRegister/${idCardNo}/queryBillingAccount`;
    return this.http.get(getBillingAccountAPI).toPromise();
  }

  getBillingByMobileNo(mobileNo: string): Promise<any> {
    if (!mobileNo) {
      return Promise.reject('mobile no not found.');
    }
    this.setSelectedMobileNo(mobileNo);
    const getBillingAPI = API.GET_BILLING + `${mobileNo}`;
    return this.http.get(getBillingAPI).toPromise();
  }

  getCustomerProfile(mobileNo: string): Promise<any> {
    if (!mobileNo) {
      return Promise.reject('mobile no not found.');
    }
    const getProfileAPI = API.GET_CUSTOMER_PROFILE + `${mobileNo}`;
    return this.http.get(getProfileAPI).toPromise();
  }

  getProfileByMobileNo(mobileNo: string): Promise<any> {
    const getProfileAPI = `/api/customerportal/asset/${mobileNo}/profile`;
    return this.http.get(getProfileAPI).toPromise();
  }

  setSelectedMobileNo(mobileNo: string): void {
    this.selectedMobileNo = mobileNo;
  }

  getSelectedMobileNo(): string {
    return this.selectedMobileNo;
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

  convertBillingAddressToString(billDeliveryAddress: Customer): string {
    let str: string = '';
    for (const item in billDeliveryAddress) {
      if (billDeliveryAddress.hasOwnProperty(item)) {
        str += ' ' + billDeliveryAddress[item];
      }
    }
    return str;
  }

}
