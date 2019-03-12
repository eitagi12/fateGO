import { Injectable } from '@angular/core';
import { PaymentDetailQRCode } from 'mychannel-shared-libs';

@Injectable({
  providedIn: 'root'
})
export class QrcodePaymentService {

  qrcodedetail: PaymentDetailQRCode;
  qrcodeAdvancePay: PaymentDetailQRCode;
  isCashAdavancePay: boolean;
  isCashPayment: boolean;
  isSelectQRCodePayment: boolean;
  isSelectedQRCodeAdavanc: boolean;
  summaryPriceQRCodePayment: number;
  qrCodePaymentDesc: string;
  qrCodePaymentType: string;
  qrCodeAdvancPaymentDesc: string;
  // qrCodeQueueSummary: qrQueueSummaryModel;
  constructor() {

  }

  public setQRcodePaymentSelected(qrcodedetail: PaymentDetailQRCode): any {
    this.qrcodedetail = qrcodedetail;
  }

  public getQRcodePaymentSelected(): any {
    return this.qrcodedetail;
  }

  public setQRcodeAdvancePaymentSelected(qrcodeAdvancePay: PaymentDetailQRCode): any {
    this.qrcodeAdvancePay = qrcodeAdvancePay;
  }
  public getQRcodeAdvancePaymentSelected(): any {
    return this.qrcodeAdvancePay;
  }

  public setIsCashAdavancPay(isCash: boolean): any {
    this.isCashAdavancePay = isCash;
  }

  public getIsCashAdavancPay(): any {
    return this.isCashAdavancePay;
  }
  public setIsCashQRPayment(isCash: boolean): any {
    this.isCashPayment = isCash;
  }

  public getIsCashQRPayment(): any {
    return this.isCashPayment;
  }

  public setIsSelectQRCodePayment(isSelectedQRCode: boolean): any {
    this.isSelectQRCodePayment = isSelectedQRCode;
  }
  public getIsSelectQRCodePayment(): any {
    return this.isSelectQRCodePayment;
  }
  public setIsSelectQRCodeAdvanc(isSelectedQRCode: boolean): any {
    this.isSelectedQRCodeAdavanc = isSelectedQRCode;
  }

  public getIsSelectQRCodeAdvanc(): any {
    return this.isSelectedQRCodeAdavanc;
  }

  public setSummaryPriceQRCodePayment(summaryPrice: number): any {
    this.summaryPriceQRCodePayment = summaryPrice;
  }
  public getSummaryPriceQRCodePayment(): any {
    return this.summaryPriceQRCodePayment;
  }
  public setQRCodePaymentDesc(paymentDesc: string): any {
    this.qrCodePaymentDesc = paymentDesc;
  }
  public getQRCodePaymentDesc(): any {
    return this.qrCodePaymentDesc;
  }
  public setQRCodePaymentType(paymentType: string): any {
    this.qrCodePaymentType = paymentType;
  }
  public getQRCodePaymentType(): any {
    return this.qrCodePaymentType;
  }
  public setQRCodeAdvancPaymentDesc(paymentDesc: string): any {
    this.qrCodeAdvancPaymentDesc = paymentDesc;
  }
  public getQRCodeAdvancPaymentDesc(): any {
    return this.qrCodeAdvancPaymentDesc;
  }

  // public getQrQueueSummaryModel(queueSummary: qrQueueSummaryModel) {
  //   return this.qrCodeQueueSummary = queueSummary;
  // }
}
