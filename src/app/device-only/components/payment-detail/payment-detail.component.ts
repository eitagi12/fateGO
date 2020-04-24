import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

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

  @Input()
  location: string;

  paymentValue: any;
  isShowCreditOnline: boolean = true;
  isShowQrCode: boolean;
  paymentQrCodeType: any;
  isAWN: boolean;

  constructor(
  ) { }

  ngOnInit(): void {
    this.checkQrCodeSelected();
    this.setPaymentValue();

    if (this.location && this.location === '63259') {
      if (this.paymentDetail.omisePayment) {
        this.isAWN = true;
        this.setPaymentValueOnlineCredit();
      } else {
        this.isAWN = false;
        this.isShowQrCode = true;
        this.error.emit(false);
      }
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

  defaultChecked(): boolean {
    if (this.isAWN) {
      return true;
    } else {
      return false;
    }
  }

}
