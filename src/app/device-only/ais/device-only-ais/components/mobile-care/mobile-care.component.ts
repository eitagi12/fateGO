import { Component, OnInit, Input, ViewChild, TemplateRef, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, FormControl } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { WIZARD_DEVICE_ONLY_AIS } from '../../constants/wizard.constant';
import { AlertService } from 'mychannel-shared-libs';
import { MobileNoService } from './mobile-no.service';

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
  styleUrls: ['./mobile-care.component.scss'],
  providers: [MobileNoService]
})
export class MobileCareComponent implements OnInit {
  wizards: string[] = WIZARD_DEVICE_ONLY_AIS;
  public moblieNo: string;
  public otp: string;
  public isPrivilegeCustomer: boolean = false;
  public mobileNoPost: string;
  public VAT: number = 1.07;
  public isValidNotBuyMobile: boolean = false;

  @Input()
  mobileCare: MobileCare;
  @Input() promotionMock: any;

  @Input()
  normalPrice: number;

  @Output()
  completed: EventEmitter<any> = new EventEmitter<any>();

  @Output() verifyOtp: EventEmitter<any> = new EventEmitter<any>();

  @Output() checkBuyMobileCare: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('template')
  template: TemplateRef<any>;
  modalRef: BsModalRef;
  // myForm: FormGroup;
  public privilegeCustomerForm: FormGroup;
  mobileCareForm: FormGroup;
  notBuyMobileCareForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private alertService: AlertService,
    private mobileNoService: MobileNoService
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.oncheckValidators();
  }

  oncheckValidators(): void {
    this.privilegeCustomerForm = new FormGroup({
      'mobileNo': new FormControl('', [
        Validators.maxLength(10),
        Validators.minLength(10),
        Validators.pattern('^(0)(6|8|9)[0-9]*$|^((88)(6|8|9)[0-9]*)$'),
        Validators.required,
      ]),
      'otpNo': new FormControl('', [
        Validators.maxLength(4),
        Validators.required
      ]),
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
    this.checkSelectNotbuyMobilecare();
  }

  public checkSelectNotbuyMobilecare(): void {
    this.notBuyMobileCareForm.valueChanges.subscribe((value: any) => {
      if (!value.notBuyMobile) {
        this.isValidNotBuyMobile = false;
        this.checkBuyMobileCare.emit(false);

      } else {
        this.isValidNotBuyMobile = true;
        this.checkBuyMobileCare.emit(true);
      }
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

  public searchMobileNo(): void {
    if (this.privilegeCustomerForm.value) {
      this.checkMobileNo(this.privilegeCustomerForm.value.mobileNo);
    } else {
      this.alertService.notify({
        type: 'warning',
        confirmButtonText: 'OK',
        showConfirmButton: true,
        text: 'กรุณาระบุหมายเลขโทรศัพท์ให้ถูกต้อง'
      });
    }
  }

  public checkMobileNo(mobileNo: string): void {
    const MOBILE_NO_POSTPAID = '0889540584';
    if (mobileNo === MOBILE_NO_POSTPAID) {
      this.isPrivilegeCustomer = !this.isPrivilegeCustomer;
      this.popupMobileCare();
    } else {
      this.alertService.notify({
        type: 'error',
        confirmButtonText: 'OK',
        showConfirmButton: true,
        text: 'เบอร์ไม่ถูกต้อง'
    });
    }
  }

  private popupMobileCare(): void {
    const form = this.privilegeCustomerForm.getRawValue();
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
      html: `หมายเลข ${this.mobileNoService.getMobileNo(form.mobileNo)} สมัครบริการโมบายแคร์กับเครื่อง <br> Samsung Note 9 เรียบร้อยแล้ว
      <br> (แพ็กเกจ xxxxxx สิ้นสุด dd/mm/yyyy) <br> กรุณาเปลี่ยนเบอร์ใหม่ หรือยืนยันสมัครบริการโมบายแคร์กับ <br>
      เครื่อง Samsung S10 Plus`
    });
  }

  public checkVerify(): void {
    this.verifyOtp.emit(true);
  }

}
