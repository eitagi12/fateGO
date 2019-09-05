import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Customer } from 'src/app/shared/models/transaction.model';
import { Subject } from 'rxjs';
import { API } from 'src/app/device-only/constants/api.constant';
@Injectable({
  providedIn: 'root'
})
export class CustomerInformationService {

  private selectedMobileNo: string;
  public unsubscribe: any;
  public cancelreadcard: Subject<boolean> = new Subject<boolean>();
  public isReadCard: boolean = false;
  public _isAddressBySmartCard: boolean;
  private _isNonAis: string;
  private chargeType: string;
  private mobileNoStatus: string;

  constructor(
    private http: HttpClient
  ) { }

  setDisableReadCard(): void {
    this.isReadCard = true;
  }

  unSetDisableReadCard(): void {
    this.isReadCard = false;
  }

  getZipCode(province: string, amphur: string, tumbol: string): Promise<any> {
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
    if (mobileNo) {
      const getBillingAPI = API.GET_BILLING + `${mobileNo}`;
      return this.http.get(getBillingAPI).toPromise();
    } else {
      return Promise.reject('mobile no not found.');
    }
  }

  getCustomerProfile(mobileNo: string): Promise<any> {
    if (!mobileNo) {
      return Promise.reject('mobile no not found.');
    }
    this.setSelectedMobileNo(mobileNo);
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
      buildingName: billingAddress.buildingName,
      floor: billingAddress.floor,
      room: billingAddress.room || '',
      street: billingAddress.streetName,
      soi: billingAddress.soi,
      tumbol: billingAddress.tumbol,
      amphur: billingAddress.amphur,
      province: billingAddress.provinceName,
      zipCode: billingAddress.portalCode,
    };
    return customer;
  }

  convertBillingAddressToString(billDeliveryAddress: Customer): string {
    const addressCus: any = {
      homeNo: billDeliveryAddress.homeNo || '',
      moo: billDeliveryAddress.moo ? 'หมู่ ' + billDeliveryAddress.moo : '',
      mooBan: billDeliveryAddress.mooBan ? 'หมู่บ้าน' + billDeliveryAddress.mooBan : '',
      buildingName: billDeliveryAddress.buildingName || '',
      floor: billDeliveryAddress.floor || '',
      room: billDeliveryAddress.room || '',
      street: billDeliveryAddress.street ? 'ถนน ' + billDeliveryAddress.street : '',
      soi: billDeliveryAddress.soi ? 'ซอย ' + billDeliveryAddress.soi : '',
      tumbol: billDeliveryAddress.tumbol ? 'ตำบล' + billDeliveryAddress.tumbol : '',
      amphur: billDeliveryAddress.amphur ? 'อำเภอ' + billDeliveryAddress.amphur : '',
      province: billDeliveryAddress.province || billDeliveryAddress.provinceName || '',
      zipCode: billDeliveryAddress.zipCode || billDeliveryAddress.portalCode,
    };

    let str: string = '';
    for (const item in addressCus) {
      if (addressCus.hasOwnProperty(item)) {
        str += ' ' + addressCus[item];
      }
    }
    return str;
  }

  public get isNonAis(): string {
    return this._isNonAis;
  }
  public set isNonAis(value: string) {
    this._isNonAis = value;
  }

  getAddressBySmartCard(): boolean {
    return this._isAddressBySmartCard;
  }

  setAddressBySmartCard(isAddressBySmartCard: boolean): void {
    this._isAddressBySmartCard = isAddressBySmartCard;
  }

  getMobileNoStatus(): string {
    return this.mobileNoStatus;
  }

  setMobileNoStatus(mobileNo: string): void {
    this.mobileNoStatus = mobileNo;
  }

  getChargeType(): string {
    return this.chargeType;
  }

  setChargeType(isChargeType: string): void {
    this.chargeType = isChargeType;
  }

}
