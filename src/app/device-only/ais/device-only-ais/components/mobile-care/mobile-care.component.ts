import { Component, OnInit, Input, ViewChild, TemplateRef, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';


export interface MobileCare {
  nextBillEffective?: boolean;
  existingMobileCare?: boolean;
  campaignPrice: number;
  promotions?: MobileCareGroup[];
}

export interface MobileCareGroup {
  title: string;
  icon?: 'swap' | 'replace';
  active?: boolean;
  sanitizedName?: string;
  items?: MobileCareItem[];
  itemsSerenade?: MobileCareItem[];
}

export interface MobileCareItem {
  id: string;
  title: string;
  priceExclVat: number;
  value: any;
}


@Component({
  selector: 'app-mobile-care',
  templateUrl: './mobile-care.component.html',
  styleUrls: ['./mobile-care.component.scss']
})
export class MobileCareComponent implements OnInit {

  public VAT: number = 1.07;

  @Input()
  mobileCare: MobileCare;

  @Input()
  normalPrice: number;

  @Output()
  completed: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('template')
  template: TemplateRef<any>;
  modalRef: BsModalRef;

  mobileCareForm: FormGroup;
  notBuyMobileCareForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.mobileCareForm = this.fb.group({
      'mobileCare': [true, Validators.required],
      'promotion': ['', Validators.required]
    });

    this.notBuyMobileCareForm = this.fb.group({
      'notBuyMobile': [''],
    });

    this.mobileCareForm.valueChanges.subscribe((value: any) => {
      if (!value.mobileCare) {
        return this.onOpenNotBuyMobileCare();
      } else {
        this.notBuyMobileCareForm.patchValue({
          notBuyMobile: ''
        });
      }
      if (this.mobileCareForm.valid) {
        this.completed.emit(this.mobileCareForm.value.promotion.value);
      }
    });
  }

  getServiceChange(percentage: number): number {
    return ((this.normalPrice || 10000) * (percentage / 100) * (this.VAT / 100));
  }

  onOpenNotBuyMobileCare() {
    this.modalRef = this.modalService.show(this.template, {
      ignoreBackdropClick: true
    });
  }

  onNotBuyMobileCare(dismiss: boolean) {
    if (dismiss) { // cancel
      this.mobileCareForm.patchValue({
        mobileCare: true
      });
    } else {
      this.completed.emit(this.notBuyMobileCareForm.value.notBuyMobile);
    }
    this.modalRef.hide();
  }

}
