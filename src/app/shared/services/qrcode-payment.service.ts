import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, timer, Observable } from 'rxjs';
import { Transaction, Payment } from '../models/transaction.model';
import { TransactionService } from './transaction.service';
import { switchMap, map } from 'rxjs/operators';

export class QRCodeModel {
  public orderId: string;
  public channel: string;
  public serviceId: string;
  public terminalId: number;
  public locationName: string;
  public amount: number;
  public qrType: string;
  public macAddress: string;
  public company: string;
}

export class QRCode {
  id: number;
  name: string;
  imageUrl: string;
  qrType: string;
}

export interface QRCodeInquiryCallBackModel {
  orderId: string;
  tranId?: string;
}

export interface ImageBrannerQRCode {
  code: string;
  logo: string;
  branner: string;
  branner_detail: string;
}

export class QRCodePrePostMpayModel {
  orderId: string;
  tranDtm: string;
  tranId: string;
  amount: number;
  qrType: string;
  status: string;
  locationCode: string;
  offerId: string;
  startDtm: string;
}

@Injectable({
  providedIn: 'root'
})
export class QRCodePaymentService {

  private apiQRCode: string = '/api/salesportal/mpay/generate-qr-code';
  private apiQRCodeInquiryCallBackMpay: string = '/api/salesportal/mpay/check-response-mpay';
  private apiQRCodeInquiryMpay: string = '/api/salesportal/mpay/inquiry';
  private intervalTime: number = 5000;
  private initialDelay: number = 15000;
  private apiUpdatePostMpay: string = '/api/salesportal/mpay/mpay-notify';
  private apiInsertPreMpay: string = '/api/salesportal/mpay/mpay-insert';

  checkInquiryCallbackMpayRes: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private http: HttpClient,
    private transactionService: TransactionService) { }

  getQRCode(bodyRequest: QRCodeModel): Promise<any> {
    return this.http.post(this.apiQRCode, bodyRequest).toPromise();
  }

  getBrannerImagePaymentQrCodeType(paymentQrCodeType: string): any {
    if (paymentQrCodeType === 'THAI_QR') {
      return {
        code: '003',
        logo: 'assets/images/icon/Thai_Qr_Payment.png',
        branner: 'assets/images/icon/th_qr_code_branner.png',
        branner_detail: 'assets/images/icon/prompt-pay.png'
      };
    } else if (paymentQrCodeType === 'LINE_QR') {
      return {
        code: '002',
        logo: 'assets/images/icon/Rabbit_Line_Pay.png',
        branner: 'assets/images/icon/line_qr_code_branner.png',
        branner_detail: ''
      };
    } else {
      return {
        code: null,
        logo: null,
        branner: null,
        branner_detail: null
      };
    }
  }

  convertTimeForRender(t: number): string {
    let minutes: number = this.convertTimeToMinutes(t);
    let seconds: number = this.convertTimeToSeconds(t, minutes);
    let prefixSeconds = '';
    let prefixMinutes = '';
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

  getSoID(): { soID: string, error: string } {
    const transaction: Transaction = this.transactionService.load();
    if (transaction && transaction.data && transaction.data.order && transaction.data.order.soId) {
      return { soID: transaction.data.order.soId, error: null };
    }
    return { soID: null, error: 'เกิดข้อผิดพลาด ระบบไม่สามารถเรียก orderID(soID) มาใช้งานได้' };
  }

  checkInquiryCallbackMpay(bodyRequest: QRCodeInquiryCallBackModel): Observable<any> {
    const source = timer(this.initialDelay, this.intervalTime);
    return source.pipe(map((res: any) => res.data || {}), switchMap(() => this.getInquiryCallbackMpay(bodyRequest)));
  }

  getInquiryCallbackMpay(bodyRequest: QRCodeInquiryCallBackModel): Promise<any> {
    return this.http
      .post(this.apiQRCodeInquiryCallBackMpay, bodyRequest).toPromise();
  }

  getInquiryMpay(bodyRequest: QRCodeInquiryCallBackModel): Promise<any> {
    return this.http
      .post(this.apiQRCodeInquiryMpay, bodyRequest)
      .toPromise();
  }

  updatePostMpay(bodyRequest: QRCodePrePostMpayModel): Promise<any> {
    return this.http.post(this.apiUpdatePostMpay, bodyRequest).toPromise();
  }

  insertPreMpay(bodyRequest: QRCodePrePostMpayModel): Promise<any> {
    return this.http.post(this.apiInsertPreMpay, bodyRequest).toPromise();
  }

  updateMpayObjectInTransaction(data: any): void {
    const transaction: Transaction = this.transactionService.load();
    transaction.data.mpayPayment = data;
    // transaction.data.mpay_payment = data;
    this.transactionService.update(transaction);
  }

}
