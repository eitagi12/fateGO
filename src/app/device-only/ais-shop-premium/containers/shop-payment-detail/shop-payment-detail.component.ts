import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface PaymentDetail {
  commercialName: string;
  promotionPrice: number;
  isFullPayment?: boolean;
  installmentFlag?: boolean;
  advancePay?: number;
  qrCode?: boolean;
}

export interface PaymentDetailBank {
  abb: string;
  imageUrl: string;
  installment: string;
  name: string;
  remark: string;
}

@Component({
  selector: 'app-shop-payment-detail',
  templateUrl: './shop-payment-detail.component.html',
  styleUrls: ['./shop-payment-detail.component.scss']
})
export class ShopPaymentDetailComponent implements OnInit {

  @Input()
  paymentDetail: PaymentDetail;

  @Input()
  banks: PaymentDetailBank[];

  @Input()
  omiseBanks: PaymentDetailBank[];

  @Output()
  completed: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  error: EventEmitter<boolean> = new EventEmitter<boolean>();

  paymentDetailForm: FormGroup;
  isPaymentDetailCollapsed: boolean;
  //
  paymentDetailAdvancePayForm: FormGroup;
  isPaymentDetailAdvancePayCollapsed: boolean;
  //
  installments: PaymentDetailBank[];

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.paymentDetailForm = this.fb.group({
      'paymentQrCodeType': [''],
      'paymentType': ['', Validators.required],
      'paymentForm': [''],
      'paymentBank': [''],
      'paymentMethod': ['']
    }, { validator: this.customValidate.bind(this) });

    // Advance pay
    this.paymentDetailAdvancePayForm = this.fb.group({
      'paymentQrCodeType': [''],
      'paymentType': ['DEBIT', Validators.required],
      'paymentBank': ['']
    }, { validator: this.customValidate.bind(this) });

    // Events
    this.paymentDetailForm.controls['paymentType'].valueChanges.subscribe((obs: any) => {
      this.changePaymentType(obs, this.paymentDetailForm, this.paymentDetailAdvancePayForm);
    });

    this.paymentDetailAdvancePayForm.controls['paymentType'].valueChanges.subscribe((obs: any) => {
      this.changePaymentType(obs, this.paymentDetailAdvancePayForm, this.paymentDetailForm);
    });

    this.paymentDetailForm.controls['paymentQrCodeType'].valueChanges.subscribe((obs: any) => {
      this.changePaymentQrCodeType(obs, this.paymentDetailForm, this.paymentDetailAdvancePayForm);
    });

    this.paymentDetailAdvancePayForm.controls['paymentQrCodeType'].valueChanges.subscribe((obs: any) => {
      this.changePaymentQrCodeType(obs, this.paymentDetailAdvancePayForm, this.paymentDetailForm);
    });

    this.paymentDetailForm.controls['paymentBank'].valueChanges.subscribe((bank: any) => {
      this.paymentDetailForm.patchValue({ paymentMethod: '' });
      if (this.paymentDetail.isFullPayment) {
        return;
      }
      this.installments = (this.banks || []);
    });

    this.paymentDetailForm.valueChanges.subscribe(() => this.onCheckFormAndEmitValue());
    this.paymentDetailAdvancePayForm.valueChanges.subscribe(() => this.onCheckFormAndEmitValue());
    this.paymentDetailForm.controls['paymentForm'].disable();
  }

  customValidate(group: FormGroup): any {
    switch (group.value.paymentType) {
      case 'QR_CODE':
        if (!group.value.paymentQrCodeType) {
          return { field: 'paymentQrCodeType' };
        }
        break;
      case 'CREDIT':
        if (group.value.paymentBank) {
          if (!this.paymentDetail.isFullPayment
            // Advance pay จะไม่มี paymentMethod ไม่ต้อง check
            && group.controls['paymentMethod']
            && !group.value.paymentMethod) {
            return { field: 'paymentMethod' };
          }
        } else {
          return { field: 'paymentBank' };
        }
        break;
    }
    return null;
  }

  changePaymentType(paymentType: string, sourceControl: any, targetControl: any): void {
    let paymentQrCodeType;
    if (paymentType === 'QR_CODE'
      && targetControl.value.paymentType === 'QR_CODE') {
      paymentQrCodeType = targetControl.value.paymentQrCodeType;
    }
    sourceControl.patchValue({
      paymentQrCodeType: paymentQrCodeType ? paymentQrCodeType : '',
      paymentBank: ''
    }, { emitEvent: false });
  }

  changePaymentQrCodeType(qrCodeType: string, sourceControl: any, targetControl: any): void {
    const value = targetControl.value;
    if (!(qrCodeType && value.paymentType === 'QR_CODE')) {
      return;
    }
    targetControl.patchValue({
      paymentQrCodeType: qrCodeType ? qrCodeType : ''
    }, { emitEvent: false });
    sourceControl.patchValue({
      paymentQrCodeType: qrCodeType ? qrCodeType : ''
    }, { emitEvent: false });
  }

  onCheckFormAndEmitValue(): void {
    if (this.paymentDetailForm.value) {
      this.completed.emit({
        payment: Object.assign({
          paymentForm: 'FULL'
        }, this.paymentDetailForm.value),
      });
    } else {
      this.completed.emit(null);
    }

  }

  getBanks(): PaymentDetailBank[] {
    return (this.banks || []).reduce((prev: any, curr: any) => {
      const exists = prev.find(p => p.abb === curr.abb);
      if (!exists) {
        prev.push(curr);
      }
      return prev;
    }, []);
  }

}
