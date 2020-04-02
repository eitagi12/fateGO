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
  selector: 'app-payment-detail',
  templateUrl: './payment-detail.component.html',
  styleUrls: ['./payment-detail.component.scss']
})
export class PaymentDetailComponent implements OnInit {

  @Input()
  paymentDetail: PaymentDetail;

  @Input()
  banks: PaymentDetailBank[];

  @Input()
  isJaymart: string;

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

  flowJaymart: boolean;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.createForm();
    if (this.isJaymart === 'Retail Chain') {
      this.flowJaymart = true;
    } else {
      this.flowJaymart = false;
    }
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
      this.installments = (this.banks || [])
        .filter((b: any) => b.abb === bank.abb)
        .reduce((prev: any, curr: any) => {
          const instalmment = (curr.installment || '').split(/เดือน|%/);
          if (instalmment && instalmment.length >= 1) {
            curr.percentage = +instalmment[0];
            curr.month = +instalmment[1];
          } else {
            curr.percentage = 0;
            curr.month = 0;
          }
          if (!prev.find(p => p.month === curr.month && p.percentage === curr.percentage)) {
            prev.push(curr);
          }
          return prev;
        }, [])
        .sort((a, b) => {
          // month + percentage to string and convert to number
          const aMonthAndPercentage = +`${a.month}${a.percentage}`;
          const bMonthAndPercentage = +`${b.month}${b.percentage}`;
          return bMonthAndPercentage - aMonthAndPercentage;
        });
    });

    this.paymentDetailForm.valueChanges.subscribe(() => this.onCheckFormAndEmitValue());
    this.paymentDetailAdvancePayForm.valueChanges.subscribe(() => this.onCheckFormAndEmitValue());

    this.paymentDetailForm.patchValue({
      paymentType: this.paymentDetail.isFullPayment ? 'DEBIT' : 'CREDIT',
      paymentForm: this.paymentDetail.isFullPayment ? 'FULL' : 'INSTALLMENT'
    });
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
      paymentQrCodeType: paymentQrCodeType,
      paymentBank: ''
    }, { emitEvent: false });
  }

  changePaymentQrCodeType(qrCodeType: string, sourceControl: any, targetControl: any): void {
    const value = targetControl.value;
    if (!(qrCodeType && value.paymentType === 'QR_CODE')) {
      return;
    }
    targetControl.patchValue({
      paymentQrCodeType: qrCodeType
    }, { emitEvent: false });
    sourceControl.patchValue({
      paymentQrCodeType: qrCodeType
    }, { emitEvent: false });
  }

  onCheckFormAndEmitValue(): void {
    const paymentDetailvalid = this.paymentDetailForm.valid;
    const paymentDetailAdvancePayvalid = this.paymentDetailAdvancePayForm.valid;

    const valid = this.paymentDetail.installmentFlag
      ? (paymentDetailvalid && paymentDetailAdvancePayvalid)
      : paymentDetailvalid;

    this.error.emit(valid);
    if (valid) {
      this.completed.emit({
        payment: Object.assign({
          paymentForm: this.paymentDetail.isFullPayment ? 'FULL' : 'INSTALLMENT'
        }, this.paymentDetailForm.value),
        advancePayment: this.paymentDetailAdvancePayForm.value
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
