import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { toDataURL } from 'qrcode';

@Injectable({
  providedIn: 'root'
})
export class QrCodeOmisePageService {

  constructor(
    private http: HttpClient
  ) { }

  createOrder(params: Object): Promise<any> {
    return this.http.post('/api/payments/super-duper/create-order', params).toPromise();
  }

  queryOrder(params: Object): Promise<any> {
    return this.http.get('/api/salesportal/super-duper/query-order', params).toPromise();
  }

  retriveOrder(params: Object): Promise<any> {
    return this.http.get('/api/salesportal/super-duper/order', params).toPromise();
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

  checkPaymentResponseOrderStatus(orderId: string, delayMs: number = 5000): Observable<any> {
    return new Observable(obs => {
      let omiseResponseTimeout;
      const checkPaymentResponseOrderTimeout = (delay) => {
        this.queryOrder({ params: { orderId: orderId } })
          .then(resp => {
            const data = resp.data || {};
            if (data.paymentCode && data.paymentStatus) {
              obs.next({
                paymentCode: data.paymentCode,
                paymentStatus: data.paymentStatus
              });
            } else {
              omiseResponseTimeout = setTimeout(() =>
                checkPaymentResponseOrderTimeout(delay), delay
              );
            }

          });
      };
      checkPaymentResponseOrderTimeout(delayMs);
      return () => {
        clearTimeout(omiseResponseTimeout);
      };
    });
  }
}
