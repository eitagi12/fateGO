import { Component, OnInit, ViewChild, TemplateRef, ElementRef, Output, EventEmitter } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-device-only-read-card',
  templateUrl: './device-only-read-card.component.html',
  styleUrls: ['./device-only-read-card.component.scss']
})
export class DeviceOnlyReadCardComponent implements OnInit {

  @Output() customerInfo: EventEmitter<Object> = new EventEmitter<Object>();

  public customerInfoMock: Array<object> = [
    {
      taxId: '',
      name: 'นาย ธีระยุทธ เจโตวิมุติพงศ์',
      mobileNo: '0889540584',
      billingAddress: 'ซ.พหลโยธิน 9 ตึก ESV ชั้น 22 แขวงสามเสนใน เขตพญาไท กรุงเทพฯ 10400',
      status: 'Active'
    }
  ];
  public canReadSmartCard: boolean = true;
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
    if (this.canReadSmartCard) {
      let width = 1;
      this.progressBarArea.nativeElement.style.display = 'block';
      this.canReadSmartCard = false;
      const id = setInterval(() => {
        if (width >= 100) {
          clearInterval(id);
          this.modalBillAddress = this.bsModalService.show(this.selectBillingAddressTemplate);
        } else {
          width += 2;
          this.progressBarReadSmartCard.nativeElement.style.width = width + '%';
        }
      }, 25);
    } else {
      setTimeout(() => {
        this.canReadSmartCard = true;
      }, 10);
    }
  }

  public closeModalSelectAddress(): void {
    this.modalBillAddress.hide();
    this.canReadSmartCard = true;
  }

  public selectBillingAddress(): void {
    this.modalBillAddress.hide();
    this.canReadSmartCard = true;
    this.customerInfo.emit(this.customerInfoMock[0]);
  }

}
