import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit, ElementRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-device-only-read-card',
  templateUrl: './device-only-read-card.component.html',
  styleUrls: ['./device-only-read-card.component.scss']
})
export class DeviceOnlyReadCardComponent implements OnInit {

  public name: string = 'นาย ธีระยุทธ เจโตวิมุติพงศ์';
  public selectBillingAddressForm: FormGroup;

  @ViewChild('select_billing_address')
  selectBillingAddressTemplate: TemplateRef<any>;
  modalBillAddress: BsModalRef;

  @ViewChild('progressBarArea') progressBarArea: ElementRef;
  @ViewChild('progressBarReadSmartCard') progressBarReadSmartCard: ElementRef;

  constructor(
    private bsModalService: BsModalService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.createSelectBillingAddressForm();
    this.progressBarArea.nativeElement.style.display = 'none';
  }

  public createSelectBillingAddressForm(): void {
    this.selectBillingAddressForm = this.fb.group({
      'billingAddress': '',
    });
  }

  public readCard(): void {
    let width = 1;
    this.progressBarArea.nativeElement.style.display = 'block';
    const id = setInterval(() => {
      if (width >= 100) {
        clearInterval(id);
        this.modalBillAddress = this.bsModalService.show(this.selectBillingAddressTemplate);
      } else {
        width += 2;
        this.progressBarReadSmartCard.nativeElement.style.width = width + '%';
      }
    }, 25);
  }

  public closeModalSelectAddress(): void {
    this.modalBillAddress.hide();
  }

  public selectBillingAddress(): void {

  }

}
