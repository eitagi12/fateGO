import { Injectable } from '@angular/core';
import { Utils, TokenService, User, PaymentDetailQRCode } from 'mychannel-shared-libs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DepositSummaryServicesService {
  user: User;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {
    this.user = this.tokenService.getUser();
  }
  getBanks(): Promise<any> {
    return this.http.post('/api/salesportal/banks-promotion', {
      location: this.user.locationCode
    }).toPromise().then((response: any) => {
      return response.data.map((bank) => {
        return {
          abb: bank.abb,
          imageUrl: bank.imageUrl,
          name: bank.name,
          promotion: '',
          installment: '',
          remark: '',
          installmentDatas: new Array<any>()
        };
      });
    });
  }
}
