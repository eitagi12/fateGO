import { Component, OnInit, Input, ViewChild, TemplateRef, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, FormControl } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { ROUTE_DEVICE_ONLY_AIS_SELECT_PAYMENT_AND_RECEIPT_INFORMATION_PAGE, ROUTE_DEVICE_ONLY_AIS_SUMMARY_PAGE } from '../../constants/route-path.constant';
import { WIZARD_DEVICE_ONLY_AIS } from '../../constants/wizard.constant';
import { AlertService } from 'mychannel-shared-libs';

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
  wizards: string[] = WIZARD_DEVICE_ONLY_AIS;
  public moblieNo: string;
  public otp: string;
  public isPrivilegeCus: boolean = false;

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
  myForm: any;
  mobileCareForm: FormGroup;
  notBuyMobileCareForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private router: Router,
    private alertService: AlertService,
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.oncheckValidators();
  }

  oncheckValidators(): void {
    this.myForm = new FormGroup({
      'mobileNo': new FormControl('', [Validators.required, Validators.maxLength(10)]),
      'otpNo': new FormControl('', [Validators.required, Validators.maxLength(5)]),
    });
  }

  keyPress(event: any): void {
    const pattern = /[0-9\+\-\ ]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  createForm(): void {
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
    return ((this.normalPrice || 0) * (percentage / 100) * (this.VAT / 100));
  }

  onOpenNotBuyMobileCare(): void {
    this.modalRef = this.modalService.show(this.template, {
      ignoreBackdropClick: true
    });
  }

  onNotBuyMobileCare(dismiss: boolean): void {
    if (dismiss) { // cancel
      this.mobileCareForm.patchValue({
        mobileCare: true
      });
    } else {
      this.completed.emit(this.notBuyMobileCareForm.value.notBuyMobile);
    }
    this.modalRef.hide();
  }

  public checkMobileNo(): void {
    this.isPrivilegeCus = !this.isPrivilegeCus;
    this.alertService.notify({
      type: 'warning',
      width: '80%',
      cancelButtonText: 'เปลี่ยนเบอร์ใหม่',
      cancelButtonClass: 'btn-secondary btn-lg text-black mr-2',
      confirmButtonText: 'สมัครกับเครื่องใหม่',
      confirmButtonClass: 'btn-success btn-lg text-white mr-2',
      showCancelButton: true,
      showConfirmButton: true,
      reverseButtons: true,
      allowEscapeKey: false,
      html: `หมายเลข 0xx-xxx-xxxx สมัครบริการโมบายแคร์กับเครื่อง <br> Sumsung Note 9 เรียบร้อยแล้ว
      <br> (แพ็กเกจ xxxxxx สิ้นสุด dd/mm/yyyy) <br> กรุณาเปลี่ยนเบอร์ใหม่ หรือยืนยันสมัครบริการโมบายแคร์กับ <br>
      เครื่อง iPhone 6S Plus`
    });
  }

  public onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ONLY_AIS_SELECT_PAYMENT_AND_RECEIPT_INFORMATION_PAGE]);
  }
  public onHome(): void {
    // do something
  }

  public onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ONLY_AIS_SUMMARY_PAGE]);
  }
}
