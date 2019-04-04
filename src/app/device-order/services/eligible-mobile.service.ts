import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EligibleMobile, AlertService } from 'mychannel-shared-libs';

@Injectable({
  providedIn: 'root'
})
export class EligibleMobileService {

  constructor(
    private http: HttpClient,
    private alertService: AlertService
  ) { }

  async getMobileList(
    idCard: string,
    ussdCode: string,
    mobileListType: `PREPAID` | `POSTPAID`): Promise<any> {
    try {
      const resp = await this.http.get(`/api/customerportal/newRegister/${idCard}/queryPrepaidMobileList`).toPromise();
      switch (mobileListType) {
        case `PREPAID`:
          return this.prepaidMobileList(resp).then(respPrepaid => respPrepaid);
        case `POSTPAID`:
          return this.postpaidMobileList(resp, ussdCode).then(respPostpaid => respPostpaid);
        default:
          break;
      }
    } catch (exception) {
      const error = exception && exception.error && exception.error.resultDescription || `ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้`;
      this.alertService.error(error);
      return [];
    }
  }

  async prepaidMobileList(resp: any): Promise<EligibleMobile[]> {
    const prepaidMobileList = resp.data.postpaidMobileList || [];
    const mobiles: Array<EligibleMobile> = new Array<EligibleMobile>();
    prepaidMobileList.forEach((mobile: {
      mobileNo: string;
      status: `Active` | `Suspended`;
    }) => {
      mobiles.push({ mobileNo: mobile.mobileNo, mobileStatus: mobile.status });
    });
    await Promise.all(mobiles);
    return mobiles;
  }

  async postpaidMobileList(resp: any, ussdCode: string): Promise<EligibleMobile[]> {
    const postpaidMobileList = resp.data.postpaidMobileList || [];
    const mobiles: Array<EligibleMobile> = new Array<EligibleMobile>();
    postpaidMobileList.forEach(async(mobile: any) => {
       const mobileResp = await this.checkPrivilege(mobile.mobileNo, mobile.status, ussdCode);
      return mobileResp ? mobiles.push(mobileResp) : {};
    });
    await Promise.all(mobiles);
    return mobiles;
  }

  checkPrivilege(mobileNo: string, status: string, ussdCode: string): Promise<any> {
    return new Promise((resovle, reject) => {
        this.http.post(`/api/salesportal/privilege/check-privilege`,
        {
          msisdn: mobileNo,
          shortCode: ussdCode
        })
        .toPromise()
        .then((checkPrivilegeResponse: any) => {
          const privilegeResponse: any = checkPrivilegeResponse.data || {};
          if (privilegeResponse) {
            if (privilegeResponse.status === '20000') {
              resovle({ mobileNo: mobileNo, mobileStatus: status });
            }
            switch (privilegeResponse.description) {
              case `DUPLICATE` || `SEND_MSG_AGAIN`:
               this.checkDeviceTransaction(mobileNo, ussdCode, resovle, status);
               break;
              case `MT_INVALID_CRITERIA_MAINPRO`:
               return resovle({ mobileNo: mobileNo, mobileStatus: status });
              default:
              resovle();
              break;
            }
          }
       })
      .catch(err => {
        const error = err.error.errors || '';
        const privilegeResponse = JSON.parse(error.substring(error.indexOf('{'), error.indexOf('}') + 1)) || {};
        if (privilegeResponse) {
          if (privilegeResponse.status === '20000') {
            resovle({ mobileNo: mobileNo, mobileStatus: status });
          }
          switch (privilegeResponse.description) {
            case `DUPLICATE` || `SEND_MSG_AGAIN`:
             this.checkDeviceTransaction(mobileNo, ussdCode, resovle, status);
             break;
            case `MT_INVALID_CRITERIA_MAINPRO`:
             return resovle({ mobileNo: mobileNo, mobileStatus: status });
            default:
            resovle();
            break;
          }
        }
      });
    });
  }

  checkDeviceTransaction(mobileNo: string, ussdCode: string, resovle: (value?: any) => void, status: string): void {
    this.http.post(`/api/salesportal/privilege/check-device-transaction`, {
      msisdn: mobileNo,
      shortCode: ussdCode,
      numDays: 15
    }).toPromise()
      .then((resp: any) => {
        const deviceTransactionResp: any = resp.data || {};
        if (deviceTransactionResp.status === `20000`) {
          const privilegeCode = this.checkPrivilegeCode(deviceTransactionResp.privilegeArr);
          return privilegeCode ? resovle({ mobileNo: mobileNo, mobileStatus: status }) : resovle();
        }
      }).catch(() => {
        return resovle();
      });
  }

  checkPrivilegeCode(privilegeCodes: any): any {
    privilegeCodes = privilegeCodes.filter((privilegeCode) => privilegeCode.privilegeCode !== 'used');
    if (privilegeCodes && privilegeCodes.length > 0) {
      const descPrivilegeCodeDates = privilegeCodes.sort((a, b) => {
        let dateA, dateB;
        try {
          dateA = new Date(a.submitDate);
        } catch (e) {
          dateA = null;
        }
        try {
          dateB = new Date(b.submitDate);
        } catch (e) {
          dateB = null;
        }
        return dateA && dateB ? dateB - dateA : (dateA ? -1 : (dateB ? 1 : 0));
      });
      return descPrivilegeCodeDates && descPrivilegeCodeDates.length > 0 ? descPrivilegeCodeDates[0] : null;
    } else {
      return null;
    }
  }

}
