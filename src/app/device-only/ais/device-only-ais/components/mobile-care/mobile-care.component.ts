import { Component, OnInit, Input, ViewChild, TemplateRef, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, FormControl } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { WIZARD_DEVICE_ONLY_AIS } from '../../constants/wizard.constant';
import { AlertService } from 'mychannel-shared-libs';
import { MobileNoService } from './mobile-no.service';
import { text } from '@angular/core/src/render3/instructions';

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

  @Input() promotionMock: any;

  public normalPriceMock: number;

  @Output()
  completed: EventEmitter<any> = new EventEmitter<any>();

  @Output() verifyOtp: EventEmitter<any> = new EventEmitter<any>();

  @Output() checkBuyMobileCare: EventEmitter<any> = new EventEmitter<any>();
  @Output() isReasonNotBuyMobileCare: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('template')
  template: TemplateRef<any>;
  modalRef: BsModalRef;
  public privilegeCustomerForm: FormGroup;
  mobileCareForm: FormGroup;
  notBuyMobileCareForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private alertService: AlertService,
    private mobileNoService: MobileNoService
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.oncheckValidators();
  }

  public oncheckValidators(): void {
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

  public keyPress(event: any): void {
    const pattern = /[0-9\+\-\ ]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  public createForm(): void {
    this.mobileCareForm = this.formBuilder.group({
      'mobileCare': [true, Validators.required],
      'promotion': ['', Validators.required]
    });

    this.notBuyMobileCareForm = this.formBuilder.group({
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

  public getServiceChange(percentage: number): number {
    return ((this.normalPriceMock || 0) * (percentage / 100) * (this.VAT / 100));
  }

  public onOpenNotBuyMobileCare(): void {
    this.modalRef = this.modalService.show(this.template, {
      ignoreBackdropClick: true
    });
    this.checkSelectNotbuyMobilecare();
  }

  public checkSelectNotbuyMobilecare(): void {
    this.notBuyMobileCareForm.valueChanges.subscribe((value: any) => {
      if (value.notBuyMobile) {
        this.isValidNotBuyMobile = true;
        this.enableNextButton();
      } else {
        this.isValidNotBuyMobile = false;
        this.disableNextButton();
      }
    });
  }

  private enableNextButton(): void {
    this.checkBuyMobileCare.emit(true);
  }

  private disableNextButton(): void {
    this.checkBuyMobileCare.emit(false);
  }

  public onNotBuyMobileCare(dismiss: boolean): void {
    if (dismiss) {
      this.mobileCareForm.patchValue({
        mobileCare: true
      });
    } else {
      // this.completed.emit(this.notBuyMobileCareForm.value.notBuyMobile);
      this.isReasonNotBuyMobileCare.emit(this.notBuyMobileCareForm.value.notBuyMobile);

    }
    this.modalRef.hide();
  }

  public searchMobileNo(): void {
    if (this.privilegeCustomerForm.value.mobileNo.length === 10) {
      this.checkMobileNo(this.privilegeCustomerForm.value.mobileNo);
    } else {
      this.alertService.notify({
        type: 'warning',
        confirmButtonText: 'OK',
        showConfirmButton: true,
        text: 'กรุณาระบุเบอร์ให้ครบ 10 หลัก'
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
      html: `หมายเลข ${this.mobileNoService.getMobileNo(form.mobileNo)} สมัครบริการโมบายแคร์กับเครื่อง <br> Samsung Note 9 แล้ว
      <br> (แพ็กเกจ xxxxxx สิ้นสุด dd/mm/yyyy) <br> กรุณาเปลี่ยนเบอร์ใหม่ หรือยืนยันสมัครบริการโมบายแคร์กับ <br>
      เครื่อง Samsung S10 Plus <br> <div class="text-red">*บริการโมบายแคร์กับเครื่องเดิมจะสิ้นสุดทันที</div>`
    });
  }

  public checkVerify(): void {
    if (this.privilegeCustomerForm.value.otpNo === '9999') {
      this.enableNextButton();
    } else {
      this.disableNextButton();
      this.alertService.notify({
        type: 'error',
        text: 'กรุณาระบุรหัส OTP'
      });
    }
  }

}
