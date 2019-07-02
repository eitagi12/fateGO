import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Customer } from 'src/app/shared/models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerInfoService {

  readonly ID_CARD_CONST: string = 'ID_CARD';
  readonly DATA_NOT_FOUND: RegExp = /Data Not Found./;

  constructor(
    private http: HttpClient
  ) { }

  getCustomerInfoByIdCard(idCardNo: string, zipCode?: string): Promise<Customer> {
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
      }).catch((e) => {
        if (!this.DATA_NOT_FOUND.test(e.error.resultDescription)) {
          return Promise.reject(e);
        }
        const customer: Customer = {
          idCardNo: idCardNo || '',
          idCardType: this.ID_CARD_CONST,
          titleName: '',
          firstName: '',
          lastName: '',
          birthdate: '',
          gender: '',
          caNumber: null,
          zipCode: zipCode || '',
        };
        return Promise.resolve(customer);
      });
  }

  getCustomerProfileByMobileNo(mobileNo: string, idcardNo?: string): Promise<any> {
    return this.http.get(`/api/customerportal/customerprofile/${mobileNo}`).toPromise().then((customer: any) => {
      const profile = customer.data;

      if (profile.chargeType === 'Pre-paid') {
        if (profile.mobileStatus !== '000' && profile.mobileStatus !== 'Active'
          && profile.mobileStatus !== '378' && profile.mobileStatus !== 'Suspend') {
          return Promise.reject(`ไม่สามารถทำรายการได้ กรุณาตรวจสอบสถานะหมายเลข <br> (status is : ${profile.mobileStatus})`);
        }
      } else {
        if (profile.mobileStatus !== '000' && profile.mobileStatus !== 'Active') {
          return Promise.reject('หมายเลขนี้ไม่สามารถทำรายการได้ กรุณาตรวจสอบข้อมูล');
        }
      }
      const names = profile.name.split(' ');
      const mobileProfile = {
        idCardNo: idcardNo || profile.idCard || '',
        idCardType: this.ID_CARD_CONST,
        titleName: profile.title,
        firstName: names[0],
        lastName: names[1],
        birthdate: profile.birthdate,
        gender: ''
      };
      return Promise.resolve(mobileProfile);
    }).catch((e) => {
      if (typeof e === 'string') {
        return Promise.reject(e);
      } else {
        return Promise.reject('ไม่สามารถทำรายการได้ เลขหมายนี้ไม่ใช่ระบบ AIS');
      }
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

  callUpdatePrepaidIdentify(customer: Customer, mobileNo: string): Promise<any> {
    return this.http.post('/api/customerportal/newRegister/updatePrepaidIdent', this.mapRequestUpdatePrepaidIdent(customer, mobileNo))
      .toPromise();
  }

  private mapRequestUpdatePrepaidIdent(customer: Customer, mobileNo: string): any {
    return {
      mobileNo: mobileNo || '-',
      idCardNo: customer.idCardNo || '-',
      idCardType: this.isIdCard(customer.idCardType) ? '1' : '0',
      idCardImage: customer.imageSmartCard || customer.imageReadSmartCard,
      firstName: customer.firstName || '-',
      lastName: customer.lastName || '-',
      birthdate: customer.birthdate || '01/01/1900',
      homeNo: customer.homeNo || '-',
      moo: customer.moo || '-',
      mooBan: customer.mooBan || '-',
      floor: customer.floor || '-',
      buildingName: customer.buildingName || '-',
      soi: customer.soi || '-',
      street: customer.street || '-',
      tumbol: customer.tumbol || '-',
      amphur: customer.amphur || '-',
      province: customer.province || '',
      zipCode: customer.zipCode || '-',
      isSmartCard: customer.imageReadSmartCard ? 'Y' : 'N',
      smartCardVersion: customer.imageReadSmartCard ? '1' : undefined
    };
  }

  private isIdCard(idCardType: string): boolean {
    return idCardType === this.ID_CARD_CONST;
  }

  public queryFbbInfo(request: any): Promise<any> {
    let body: {
      inOption: string;
      inIDCardNo?: string;
      inIDCardType?: string;
      inMobileNo?: string;
    };
    switch (request.option) {
      case '1':
        body = {
          inOption: request.option,
          inIDCardNo: request.idCardNo,
          inIDCardType: request.idCardType,
        };
        break;
      case '3':
        body = {
          inOption: request.option,
          inMobileNo: request.mobileNo,
        };
        break;
    }
    return this.http.post('/api/customerportal/query-fbb-info', body).toPromise().then((response: any) => {
      if (response.data.billingProfiles && response.data.billingProfiles[0].status === 'Disconnect - Customer Request') {
        const status: string = response.data.billingProfiles[0].status;
        return Promise.reject(`ไม่สามารถทำรายการได้ กรุณาตรวจสอบสถานะหมายเลข <br> (status is : ${status})`);
      } else {
        return response && response.data ? response.data : '';
      }
    }).catch((error: any) => {
      return Promise.reject(error);
    });
  }

  public getCustomerProfileByFbb(mobileNo: string): Promise<any> {
    return this.http.get(`/api/customerportal/customerprofile/${mobileNo}`).toPromise().then((profile: any) => {
      return Promise.resolve(profile);
    }).catch((e) => {
      if (typeof e === 'string') {
        return Promise.reject(e);
      } else {
        return Promise.reject(`ไม่สามารถทำรายการได้ กรุณาตรวจสอบสถานะหมายเลข ${mobileNo})`);
      }
    });
  }
}
