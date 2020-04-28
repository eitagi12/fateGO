import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';

@Component({
  selector: 'app-payment-detail',
  templateUrl: './payment-detail.component.html',
  styleUrls: ['./payment-detail.component.scss']
})
export class PaymentDetailComponent implements OnInit {

  @Output()
  completed: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  error: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input()
  paymentDetail: any;

  paymentValue: any;
  isShowCreditOnline: boolean = true;
  isShowQrCode: boolean;
  paymentQrCodeType: any;
  isAWN: boolean;
  transaction: Transaction;
  payment: any;

  constructor(
    private transactionService: TransactionService,
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.checkQrCodeSelected();
    this.setPaymentValue();
    if (this.paymentDetail && this.paymentDetail.omisePayment) {
      this.isAWN = true;
      this.setPaymentValueOnlineCredit();
    } else {
      this.isAWN = false;
      this.isShowQrCode = true;
      this.error.emit(false);
    }

    if (this.transaction && this.transaction.data && this.transaction.data.payment) {
      this.payment = this.transaction.data.payment;
      this.defaultPaymentValue();
    }
  }

  checkQrCodeSelected(): void {
    const qrCode = document.getElementById('qr');
    const qrCodeSelected = qrCode.getElementsByClassName('qr-logo');
    for (let i = 0; i < qrCodeSelected.length; i++) {
      qrCodeSelected[i].addEventListener('click', function(): void {
        const current = document.getElementsByClassName('qr-logo active');
        if (current.length > 0) {
          current[0].className = current[0].className.replace(' active', '');
        }
        this.className += ' active';
      });
    }
  }

  selectQrCode(value: any): void {
    this.paymentQrCodeType = value;
    this.setPaymentValueQrCode(this.paymentQrCodeType);
  }

  onPaymentTypeChange(value: any): void {
    if (value === 'omise') {
      this.setPaymentValueOnlineCredit();
      this.isShowCreditOnline = true;
      this.isShowQrCode = false;
    } else if (value === 'qrcode') {
      if (this.paymentQrCodeType) {
        this.setPaymentValueQrCode(this.paymentQrCodeType);
      } else {
        this.error.emit(false);
      }
      this.isShowCreditOnline = false;
      this.isShowQrCode = true;
    } else {
      this.setPaymentValueDebit();
      this.isShowCreditOnline = false;
      this.isShowQrCode = false;
    }
  }

  setPaymentValue(): void {
    this.paymentValue = {
      payment: {
        'paymentBank': '',
        'paymentForm': 'FULL',
        'paymentMethod': '',
        'paymentOnlineCredit': true,
        'paymentQrCodeType': '',
        'paymentType': ''
      }
    };
  }

  setPaymentValueOnlineCredit(): void {
    this.paymentValue.payment.paymentOnlineCredit = true;
    this.paymentValue.payment.paymentQrCodeType = '';
    this.paymentValue.payment.paymentType = 'CREDIT';
    this.completed.emit(this.paymentValue);
    this.error.emit(true);
  }

  setPaymentValueQrCode(value: any): void {
    this.paymentValue.payment.paymentOnlineCredit = false;
    this.paymentValue.payment.paymentQrCodeType = value;
    this.paymentValue.payment.paymentType = 'QR_CODE';
    this.completed.emit(this.paymentValue);
    this.error.emit(true);
  }

  setPaymentValueDebit(): void {
    this.paymentValue.payment.paymentOnlineCredit = false;
    this.paymentValue.payment.paymentQrCodeType = '';
    this.paymentValue.payment.paymentType = 'DEBIT';
    this.completed.emit(this.paymentValue);
    this.error.emit(true);
  }

  defaultPaymentValue(): void {
    if (this.payment) {
      if (this.payment.paymentType === 'QR_CODE') {
        this.paymentQrCodeType = this.payment.paymentType;
        this.setPaymentValueQrCode(this.payment.paymentQrCodeType);
        this.isShowCreditOnline = false;
        this.isShowQrCode = true;
        if (this.payment.paymentQrCodeType === 'LINE_QR') {
          document.getElementById('lineQr').className += ' active';
        } else if (this.payment.paymentQrCodeType === 'THAI_QR') {
          document.getElementById('thaiQr').className += ' active';
        }
      } else if (this.payment.paymentType === 'CREDIT') {
        this.setPaymentValueOnlineCredit();
        this.isShowCreditOnline = true;
        this.isShowQrCode = false;
      } else {
        this.setPaymentValueDebit();
        this.isShowCreditOnline = false;
        this.isShowQrCode = false;
      }
    }
  }

  defaultChecked(): string {
    if (this.payment) {
      return this.payment.paymentType;
    } else {
      const paymentType = this.isAWN ? 'CREDIT' : 'QR_CODE';
      return paymentType;
    }
  }

}
