import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { toDataURL } from 'qrcode';

@Injectable({
  providedIn: 'root'
})
export class QrCodePageService {

  constructor(
    private http: HttpClient
  ) { }

  mpayInquiry(params: Object): Promise<any> {
    return this.http.post('/api/salesportal/mpay/inquiry', params).toPromise();
  }

  generateQRCode(params: Object): Promise<any> {
    return this.http.post('/api/salesportal/mpay/generate-qr-code', params).toPromise();
  }

  checkResponseMpay(params: Object): Promise<any> {
    return this.http.post('/api/salesportal/mpay/check-response-mpay', params).toPromise();
  }

  mpayInsert(params: Object): Promise<any> {
    return this.http.post('/api/salesportal/mpay/mpay-insert', params).toPromise();
  }

  getTimeCounter(second: number): Observable<number> {
    return new Observable(obs => {
      let timerSecond = 0;
      const counterInterval = setInterval(() => {
        const countdown = second - timerSecond;
        if (countdown < 0) {
          return obs.complete();
        }
        timerSecond++;

        obs.next(countdown * 1000);
      }, 1000);
      return () => {
        clearInterval(counterInterval);
      };
    });
  }

  convertMessageToQRCode(message: string): Promise<any> {
    return new Promise((resovle, reject) => {
      toDataURL(message, {
        errorCorrectionLevel: 'H'
      }, (error: any, qrCode: any) => {
        if (error) {
          return reject(error);
        }
        return resovle(qrCode);
      });
    });
  }

  checkPaymentResponseMpayStatus(orderId: string, delayMs: number = 5000): Observable<any> {
    return new Observable(obs => {
      let mpayResponseTimeout;
      const checkPaymentResponseMpayTimeout = (delay) => {
        this.checkResponseMpay({ orderId: orderId })
          .then(resp => {
            const data = resp.data || {};
            if (data.DATA && data.DATA.mpay_payment
              && data.DATA.mpay_payment.status
              && data.DATA.mpay_payment.status === 'SUCCESS') {
              obs.next(data.DATA.mpay_payment);
            } else {
              mpayResponseTimeout = setTimeout(() =>
                checkPaymentResponseMpayTimeout(delay), delay
              );
            }
          });
      };
      checkPaymentResponseMpayTimeout(delayMs);
      return () => {
        clearTimeout(mpayResponseTimeout);
      };
    });
  }
}
