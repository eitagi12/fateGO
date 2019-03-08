import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { BillingAddressService } from '../../services/billing-address.service';

export interface ReceiptInfo {
  taxId: string;
  branch: string;
  buyer: string;
  buyerAddress: string;
  telNo: string;
}

@Component({
  selector: 'app-receipt-information',
  templateUrl: './receipt-information.component.html',
  styleUrls: ['./receipt-information.component.scss']
})
export class ReceiptInformationComponent implements OnInit {

  @Input()
  receiptInfo: ReceiptInfo;

  @Output()
  completedBillingAddress: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  completedReceiptInfo: EventEmitter<ReceiptInfo> = new EventEmitter<ReceiptInfo>();

  @Output()
  errorReceiptInfo: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  errorBillingAddress: EventEmitter<boolean> = new EventEmitter<boolean>();

  receiptInfoForm: FormGroup;
  billingAddressForm: FormGroup;
  inputBillingAddress: boolean;
  dataBillingZipCode: any;

  constructor(private fb: FormBuilder, private billingAddress: BillingAddressService) {
    this.billingAddress.getZipCode().then(response => {
      console.log('response', response);
    });
   }

  ngOnInit(): void {
    this.dataBillingZipCode = [41000, 41150];
    this.createForm();
  }

  private createForm(): void {
    this.createReceiptForm();
    this.createBillingAddressForm();
  }

  private createReceiptForm(): void {
    this.receiptInfoForm = this.fb.group({
      taxId: ['', []],
      branch: ['', []],
      buyer: ['', []],
      buyerAddress: ['', []],
      telNo: ['', [Validators.pattern(/^0[6-9]\d{8}$/)]]
    });
    this.receiptInfoForm.patchValue(this.receiptInfo);
    this.receiptInfoForm.valueChanges.pipe(debounceTime(750)).subscribe(event => {
      this.errorReceiptInfo.emit(this.receiptInfoForm.valid);
      if (this.receiptInfoForm.valid) {
        this.completedReceiptInfo.emit(this.receiptInfoForm.value);
      }
    });
  }

  private createBillingAddressForm(): void {
    this.billingAddressForm = this.fb.group({
      customerName: ['', []],
      addressNo: ['', []],
      road: ['', []],
      subDistrict: ['', []],
      district: ['', []],
      province: ['', []],
      zipcode: ['', []]
    });
    this.billingAddressForm.valueChanges.pipe(debounceTime(750)).subscribe(event => {
      this.errorReceiptInfo.emit(this.billingAddressForm.valid);
      if (this.billingAddressForm.valid) {
        console.log('billingAddressForm.value', this.billingAddressForm.value);
        this.completedBillingAddress.emit(this.billingAddressForm.value);
      }
    });
  }

  onClickInputBillingAddress(): void {
    this.inputBillingAddress = true;
  }
}
