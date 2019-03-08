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

  public setQRcodePaymentSelected(qrcodedetail: PaymentDetailQRCode) {
    this.qrcodedetail = qrcodedetail;
  }

  public getQRcodePaymentSelected() {
    return this.qrcodedetail;
  }

  public setQRcodeAdvancePaymentSelected(qrcodeAdvancePay: PaymentDetailQRCode) {
    this.qrcodeAdvancePay = qrcodeAdvancePay;
  }
  public getQRcodeAdvancePaymentSelected() {
    return this.qrcodeAdvancePay;
  }

  public setIsCashAdavancPay(isCash: boolean) {
    this.isCashAdavancePay = isCash;
  }

  public getIsCashAdavancPay() {
    return this.isCashAdavancePay;
  }
  public setIsCashQRPayment(isCash: boolean) {
    this.isCashPayment = isCash;
  }

  public getIsCashQRPayment() {
    return this.isCashPayment;
  }

  public setIsSelectQRCodePayment(isSelectedQRCode: boolean) {
    this.isSelectQRCodePayment = isSelectedQRCode;
  }
  public getIsSelectQRCodePayment() {
    return this.isSelectQRCodePayment;
  }
  public setIsSelectQRCodeAdvanc(isSelectedQRCode: boolean) {
    this.isSelectedQRCodeAdavanc = isSelectedQRCode;
  }

  public getIsSelectQRCodeAdvanc() {
    return this.isSelectedQRCodeAdavanc;
  }

  public setSummaryPriceQRCodePayment(summaryPrice: number) {
    this.summaryPriceQRCodePayment = summaryPrice;
  }
  public getSummaryPriceQRCodePayment() {
    return this.summaryPriceQRCodePayment;
  }
  public setQRCodePaymentDesc(paymentDesc: string) {
    this.qrCodePaymentDesc = paymentDesc;
  }
  public getQRCodePaymentDesc() {
    return this.qrCodePaymentDesc;
  }
  public setQRCodePaymentType(paymentType: string) {
    this.qrCodePaymentType = paymentType;
  }
  public getQRCodePaymentType() {
    return this.qrCodePaymentType;
  }
  public setQRCodeAdvancPaymentDesc(paymentDesc: string) {
    this.qrCodeAdvancPaymentDesc = paymentDesc;
  }
  public getQRCodeAdvancPaymentDesc() {
    return this.qrCodeAdvancPaymentDesc;
  }

  // public getQrQueueSummaryModel(queueSummary: qrQueueSummaryModel) {
  //   return this.qrCodeQueueSummary = queueSummary;
  // }
}
