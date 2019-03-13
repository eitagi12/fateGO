import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Customer } from 'src/app/shared/models/transaction.model';
import { Utils } from 'mychannel-shared-libs';

@Injectable({
  providedIn: 'root'
})
export class CustomerInfoService {

  constructor(
    private http: HttpClient,
    private utils: Utils
  ) {

  }

  getCustomerInfoByIdCard(idCardNo: string, zipCode?: string): Promise<any> {
    return this.http.get(`/api/customerportal/newRegister/${idCardNo}/queryCustomerInfo`)
      .toPromise()
      .then((resp: any) => {
        const data = resp.data || {};
        const fullName = (data.name || ' ').split(' ');
        const address = data.address || {};
        const customer: Customer = {
          idCardNo: idCardNo || '',
          idCardType: data.idCardType || '',
          titleName: data.accntTitle || '',
          firstName: fullName[0] || '',
          lastName: fullName[1] || '',
          birthdate: data.birthdate || '',
          homeNo: address.houseNo || '',
          moo: address.moo || '',
          mooBan: address.mooban || '',
          buildingName: address.buildingName || '',
          floor: address.floor || '',
          room: address.room || '',
          street: address.streetName || '',
          soi: address.soi || '',
          tumbol: address.tumbol || '',
          amphur: address.amphur || '',
          province: address.provinceName || '',
          zipCode: address.zipCode || zipCode || '',
          mainMobile: data.mainMobile || '',
          mainPhone: data.mainPhone || '',
          billCycle: data.billCycle || '',
          caNumber: data.accntNo || '',
          gender: data.gender || '',
          expireDate: '',
        };
        return customer;
      });
  }

  getCustomerProfileByMobileNo(idcardNo: string, mobileNo: string): Promise<any> {
    return this.http.get(`/api/customerportal/customerprofile/${mobileNo}`).toPromise()
      .then((customer: any) => {
        const profile = customer.data;
        const names = profile.name.split(' ');
        return {
          idCardNo: idcardNo || '',
          idCardType: 'ID_CARD',
          titleName: profile.title,
          firstName: names[0],
          lastName: names[1],
          birthdate: profile.birthdate,
          gender: '',
          caNumber: null
        };
      });
  }

  verifyPrepaidIdent(idCardNo: string, mobileNo: string): Promise<boolean> {
    return this.http.get(`/api/customerportal/newRegister/verifyPrepaidIdent?idCard=${idCardNo}&mobileNo=${mobileNo}`)
      .toPromise().then((response: any) => {
        if (response.data && response.data.success) {
          return true;
        } else {
          return false;
        }
      });
  }

  getZipCode(provinceId: string, amphur: string, tumbol: string): Promise<string> {
    return this.http.get(
      `/api/customerportal/newRegister/queryZipcode?provinceId=${provinceId}&amphurName=${amphur}&tumbolName=${tumbol}`
    ).toPromise().then((resp: any) => {
      if (resp.data.zipcodes && resp.data.zipcodes.length > 0) {
        return resp.data.zipcodes[0];
      } else {
        return Promise.reject('ไม่พบรหัสไปรษณีย์');
      }
    });
  }

  getProvinceId(provinceName: string): Promise<any> {
    provinceName = provinceName.replace(/มหานคร$/, '');
    return this.http.get('/api/customerportal/newRegister/getAllProvinces').toPromise()
      .then((resp: any) => {
        const provinceId = (resp.data.provinces.find((prov: any) => prov.name === provinceName) || {}).id;
          if (provinceId) {
            return provinceId;
          } else {
            return Promise.reject(`ไม่พบจังหวัด ${provinceName}`);
          }
      });
  }
}
