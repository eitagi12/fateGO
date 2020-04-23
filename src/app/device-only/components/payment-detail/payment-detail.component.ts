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
  paymentValue: any;
  isShowCreditOnline: boolean = true;
  isShowQrCode: boolean;
  paymentQrCodeType: any;

  constructor(
  ) { }

  ngOnInit(): void {
    this.checkQrCodeSelected();
    this.setPaymentValue();
    this.setPaymentValueOnlineCredit();
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
    } else {
      if (this.paymentQrCodeType) {
        this.setPaymentValueQrCode(this.paymentQrCodeType);
      } else {
        this.error.emit(false);
      }
      this.isShowCreditOnline = false;
      this.isShowQrCode = true;
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

}
