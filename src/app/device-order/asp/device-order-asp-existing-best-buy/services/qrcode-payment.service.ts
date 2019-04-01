import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QrCodePrePostMpayModel } from 'src/app/shared/models/transaction.model';
import { Observable, timer } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

export interface QrCodeModel {
  orderId: string;
  channel: string;
  serviceId: string;
  terminalId: number;
  locationName: string;
  amount: number;
  qrType: string;
  macAddress: string;
}

@Injectable({
  providedIn: 'root'
})
export class QrcodePaymentService {

  private intervalTime: number = 5000;
  private initialDelay: number = 60000;

  constructor(
    private http: HttpClient
  ) {

  }

  getQRCode(bodyRequest: any): Promise<any> {
    return this.http.post('/api/salesportal/mpay/generate-qr-code', bodyRequest)
      .toPromise().then((res: any) => res.data);
  }

  convertTimeForRender(t: number): string {
    let minutes: number = this.convertTimeToMinutes(t);
    let seconds: number = this.convertTimeToSeconds(t, minutes);
    let prefixSeconds: string = '';
    let prefixMinutes: string = '';
    const minutesOfTimeLowerThanOrEqualToZero: boolean = minutes < 0;

    if (minutesOfTimeLowerThanOrEqualToZero) {
      minutes = 0;
      seconds = 0;
    }
    if (minutes < 10) {
      prefixMinutes = '0';
    }
    if (seconds < 10) {
      prefixSeconds = '0';
    }
    return [
      prefixMinutes + minutes + ' :',
      prefixSeconds + seconds
    ].join(' ');
  }

  convertTimeToMinutes(t: number): number {
    let minutes: number;
    minutes = Math.floor(t / 60) % 60;
    return minutes;
  }

  convertTimeToSeconds(t: number, minutes: number): number {
    let seconds: number;
    t -= minutes * 60;
    seconds = t % 60;
    return seconds;
  }

  getInquiryMpay(orderId: string, tranId?: string): Promise<any> {
    return this.http.post('/api/salesportal/mpay/inquiry', { orderId: orderId, tranId: tranId })
      .toPromise();
  }

  updatePostMpay(bodyRequest: QrCodePrePostMpayModel): Promise<any> {
    return this.http.post('/api/salesportal/mpay/mpay-notify', bodyRequest)
      .toPromise().then((res: any) => res.data);
  }

  checkInquiryCallbackMpay(orderId: string, tranId?: string): Observable<any> {
    return timer(this.initialDelay, this.intervalTime).pipe(
      switchMap(() => this.getInquiryCallbackMpay(orderId, tranId)),
      map((res: any) => res.data || {}));
  }

  getInquiryCallbackMpay(orderId: string, tranId?: string): Promise<any> {
    return this.http.post('/api/salesportal/mpay/check-response-mpay', { orderId: orderId, tranId: tranId }).toPromise();
  }

  insertPreMpay(bodyRequest: QrCodePrePostMpayModel): Promise<any> {
    return this.http.post('/api/salesportal/mpay/mpay-insert', bodyRequest).toPromise();
  }
}
