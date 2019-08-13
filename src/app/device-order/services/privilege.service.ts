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
    }).catch((e) => {
      Promise.reject(e);
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
    }).catch((e) => {
      Promise.reject(e);
    });
  }

  checkAndGetPrivilegeCode(mobileNo: string, ussdCode: string): Promise<any> {
    return this.checkPrivilegeByNumber(mobileNo, ussdCode, false).then((privilegeCode) => {
      return this.requestUsePrivilege(mobileNo, ussdCode, privilegeCode).then((msgBarcode) => {
        return msgBarcode;
      }).catch(e => {
        Promise.reject('หมายเลขนี้ ไม่สามารถรับสิทธิ์ได้');
      });
    }).catch(e => {
      Promise.reject(`${e.error.resultDescription || ''} ${(e.error.developerMessage) || ''}`.trim());
    });
  }

  checkAndGetPrivilegeCodeAndCriteria(mobileNo: string, ussdCode: string): Promise<any> {
    return this.checkPrivilegeByNumberAndCriteria(mobileNo, ussdCode).then((privilegeCode) => {
      if (privilegeCode.errorMessage === 'MT_INVALID_CRITERIA_MAINPRO') {
        return privilegeCode;
      } else {
        return this.requestUsePrivilege(mobileNo, ussdCode, privilegeCode).then((msgBarcode) => {
          return msgBarcode;
        }).catch(e => {
          Promise.reject('หมายเลขนี้ ไม่สามารถรับสิทธิ์ได้');
        });
      }

    }).catch(e => {
      Promise.reject(`${e.error.resultDescription || ''} ${(e.error.developerMessage) || ''}`.trim());
    });
  }

  checkPrivilegeByNumberAndCriteria(mobileNo: string, ussdCode: string): Promise<any> {
    return this.http.post('/api/customerportal/check-privilege-by-number', {
      mobileNo: mobileNo,
      ussdCode: ussdCode,
      chkMainProFlg: false
    }).toPromise().then((checkPrivilege: any) => {
      const privilegeInfo = checkPrivilege.data;
      return privilegeInfo.privilegeCode;
    }).catch((e) => {
      const privilegeMessage = e.error.errors.privilegeMessage === 'MT_INVALID_CRITERIA_MAINPRO';
      const developerMessage = e.error.developerMessage === 'MT_INVALID_CRITERIA_MAINPRO';
      const isCriteria = !!(privilegeMessage || developerMessage);
      if (isCriteria) {
        return { errorMessage: 'MT_INVALID_CRITERIA_MAINPRO' };
      }
      Promise.reject(e);
    });
  }

}
