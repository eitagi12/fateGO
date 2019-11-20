import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { toDataURL } from 'qrcode';
import { Transaction } from 'src/app/shared/models/transaction.model';

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
    return this.http.get('/api/payments/super-duper/query-order', params).toPromise();
  }

  retriveOrder(params: Object): Promise<any> {
    return this.http.get('/api/payments/super-duper/orders', params).toPromise();
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
        this.queryOrder({ params: { orderId: orderId, randomID: new Date().getTime() } })
          .then(resp => {
            const data = resp.data || {};
            if (data.paymentCode && data.paymentStatus && data.transactionId) {
              obs.next({
                paymentCode: data.paymentCode,
                paymentStatus: data.paymentStatus,
                transactionId: data.transactionId,
                creditCardNo: data.creditCardNo,
                cardExpireDate: data.cardExpireDate,
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

  isPaymentOnlineCredit(transaction: Transaction, paymentType: string): boolean {
    const payment: any = transaction.data.payment || {};
    const advancePayment: any = transaction.data.advancePayment || {};

    if (paymentType === 'payment') {
      if (payment.paymentType === 'CREDIT' && payment.paymentOnlineCredit) {
        return true;
      } else {
        return false;
      }
    } else if (paymentType === 'advancePayment') {
      if (advancePayment.paymentType === 'CREDIT' && advancePayment.paymentOnlineCredit) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

}
