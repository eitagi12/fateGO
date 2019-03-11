import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-device-only-read-card',
  templateUrl: './device-only-read-card.component.html',
  styleUrls: ['./device-only-read-card.component.scss']
})
export class DeviceOnlyReadCardComponent implements OnInit {

  public name: string = 'ชื่อคนไง นามสกุลก็มีนะ';
  public selectBillingAddressForm: FormGroup;

  @ViewChild('select_billing_address')
  template: TemplateRef<any>;
  modalBillAddress: BsModalRef;

  constructor(
    private bsModalService: BsModalService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.createSelectBillingAddressForm();
  }

  public createSelectBillingAddressForm(): void {
    this.selectBillingAddressForm = this.fb.group({
      'billingAddress': '',
    });
    this.selectBillingAddressForm.valueChanges.subscribe((value: any) => {
      if (!value.billingAddress) {
        // this.onOpenNotSelectBillingAddress();
      }
    });
  }

  public readCard(): void {
    this.modalBillAddress = this.bsModalService.show(this.template);
  }

  public closeModalSelectAddress(): void {
    this.modalBillAddress.hide();
  }

  public selectBillingAddress(): void {

  }

}
