import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PrivilegeService {

  constructor(
    private http: HttpClient
  ) { }

  checkPrivilegeByNumber(mobileNo: string, ussdCode: string, chkMainProFlg: boolean): Promise<any> {
    return this.http.post('/api/customerportal/check-privilege-by-number', {
      mobileNo: mobileNo,
      ussdCode: ussdCode,
      chkMainProFlg: chkMainProFlg
    }).toPromise().then((checkPrivilege: any) => {
      const privilegeInfo = checkPrivilege.data;
      return privilegeInfo.privilegeCode;
    });
  }

  requestUsePrivilege(mobileNo: string, ussdCode: string, privilegeCode?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (privilegeCode) {
        resolve(privilegeCode);
      } else {
        this.http.post('/api/salesportal/privilege/request-use-privilege', {
          msisdn: mobileNo,
          shortCode: ussdCode
        }).toPromise().then((response: any) => {
          const privilege = response.data;
          if (privilege && privilege.description && privilege.description.toUpperCase() === 'SUCCESS') {
            resolve(privilege.msgBarcode);
          }
          reject(privilege);
        });
      }
    });
  }

  checkAndGetPrivilegeCode(mobileNo: string, ussdCode: string): Promise<any> {
    return this.checkPrivilegeByNumber(mobileNo, ussdCode, false).then((privilegeCode) => {
        return this.requestUsePrivilege(mobileNo, ussdCode, privilegeCode).then((msgBarcode) => {
          return msgBarcode;
        });
    });
  }
}
