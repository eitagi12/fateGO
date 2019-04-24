import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { ShopLocation, ShopEmployeeDetail } from 'src/app/shared/models/transaction.model';
import { API } from 'src/app/deposit-summary/constants/wizard.constant';
import { ERROR_MESSAGE } from 'src/app/deposit-summary/constants/message-config.constant';

@Injectable({
  providedIn: 'root'
})
export class MessageConfigService {

  public messageConfig: any = [];

  constructor(
    private http: HttpClient
  ) { }

  getMsgConfigByModuleName(languege: string, moduleName: string): any {

    const requestData = {
      'language': languege,
      'moduleName': moduleName,
    };

    return this.http.post('/api/salesportal/msg-config-by-module-name', requestData).toPromise();
  }

  mapMessageConfig(messageConfig: any, messageCode: string): any {
    if ((messageConfig !== undefined || messageConfig !== '') && (messageCode !== undefined || messageCode !== '')) {
      // tslint:disable-next-line:no-shadowed-variable
      const message = messageConfig.filter((message: any) => message.MESSAGE_CODE === messageCode);

      if (message.length > 0) {
        return message[0].MESSAGE;
      } else {
        return ERROR_MESSAGE.DEFAULT;
      }
    } else {
      return ERROR_MESSAGE.DEFAULT;
    }
  }

  setMessageConfig(message: any): void {
    this.messageConfig = message;
  }

}
