import { Injectable } from '@angular/core';
import { TokenService } from 'mychannel-shared-libs';
import { HttpClient } from '@angular/common/http';

export interface SelectMobileNumberRandom {
  userId: string;
  mobileNo: string;
  action: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReserveMobileService {

  constructor(
    private http: HttpClient
  ) { }

  selectMobileNumberRandom(selectMobileNumberRandom: SelectMobileNumberRandom): Promise<any> {
    return this.http.post('/api/customerportal/newRegister/selectMobileNumberRandom', {
      userId: selectMobileNumberRandom.userId,
      mobileNo: selectMobileNumberRandom.mobileNo,
      action: selectMobileNumberRandom.action
    }).toPromise();
  }

}
