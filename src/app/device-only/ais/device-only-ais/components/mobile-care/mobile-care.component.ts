import { Component, OnInit, Input, ViewChild, TemplateRef, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, FormControl } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { WIZARD_DEVICE_ONLY_AIS } from '../../constants/wizard.constant';
import { AlertService, PageLoadingService } from 'mychannel-shared-libs';
import { CustomerInformationService } from '../../services/customer-information.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { forEach } from '../../../../../../../node_modules/@angular/router/src/utils/collection';
import { HttpClient } from '../../../../../../../node_modules/@angular/common/http';
import { environment } from 'src/environments/environment';
import { TransactionService } from '../../../../../shared/services/transaction.service';
import { Transaction } from '../../../../../shared/models/transaction.model';

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
  providers: []
})
export class MobileCareComponent implements OnInit {
  wizards: string[] = WIZARD_DEVICE_ONLY_AIS;
  public moblieNo: string;
  public otp: string;
  public isPrivilegeCustomer: boolean = false;
  public mobileNoPost: string;
  public VAT: number = 1.07;
  public isValidNotBuyMobile: boolean = false;
  public normalPriceMock: number;
  public normalPrice: number;

  @Input() promotionMock: any;
  @Output() completed: EventEmitter<any> = new EventEmitter<any>();
  @Output() verifyOtp: EventEmitter<any> = new EventEmitter<any>();
  @Output() checkBuyMobileCare: EventEmitter<any> = new EventEmitter<any>();
  @Output() isReasonNotBuyMobileCare: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('template')
  template: TemplateRef<any>;
  modalRef: BsModalRef;
  public privilegeCustomerForm: FormGroup;
  mobileCareForm: FormGroup;
  notBuyMobileCareForm: FormGroup;
  priceOption: PriceOption;
  transaction: Transaction;
  transactionID: string;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private alertService: AlertService,
    private customerInformationService: CustomerInformationService,
    private priceOptionService: PriceOptionService,
    private http: HttpClient,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService
  ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.createForm();
    this.oncheckValidators();
  }

  public oncheckValidators(): void {
    let mobileNoDefault = this.customerInformationService.getSelectedMobileNo();
    mobileNoDefault = mobileNoDefault ? mobileNoDefault : '';
    this.privilegeCustomerForm = new FormGroup({
      'mobileNo': new FormControl(mobileNoDefault, [
        Validators.maxLength(10),
        Validators.minLength(10),
        Validators.pattern('^(0)(6|8|9)[0-9]*$|^((88)(6|8|9)[0-9]*)$'),
        Validators.required,
      ]),
      'otpNo': new FormControl('', [
        Validators.maxLength(5),
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
    return ((this.priceOption.trade.normalPrice || 0) * (percentage / 100) + (this.priceOption.trade.normalPrice || 0) * (this.VAT / 100));
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
      this.checkChargeType(this.privilegeCustomerForm.value.mobileNo);
    } else {
      this.alertService.notify({
        type: 'warning',
        confirmButtonText: 'OK',
        showConfirmButton: true,
        text: 'กรุณาระบุเบอร์ให้ครบ 10 หลัก'
      });
    }
  }

  public checkChargeType(mobileNo: string): void {
    if (mobileNo) {
      this.pageLoadingService.openLoading();
      this.customerInformationService.getProfileByMobileNo(mobileNo).then((res) => {
        if (res.data.chargeType === 'Post-paid') {
          this.pageLoadingService.closeLoading();
          this.checkMobileCare(mobileNo);
        } else {
          this.pageLoadingService.closeLoading();
          this.alertService.warning('เบอร์นี้เป็นระบบเติมเงิน ไม่สามารถทำรายการได้');
        }
      });
    } else {
      this.pageLoadingService.closeLoading();
      this.alertService.notify({
        type: 'error',
        confirmButtonText: 'OK',
        showConfirmButton: true,
        text: 'เบอร์ไม่ถูกต้อง'
      });
    }
  }

  private checkMobileCare(mobileNo: string): void {
    this.customerInformationService.getBillingByMobileNo(mobileNo).then((res: any) => {
      for (let index = 0; index < res.data.currentPackage.length; index++) {
        const productGroupPackage = res.data.currentPackage[index].produuctGroup;
        if (productGroupPackage && productGroupPackage === 'Mobile Care') {
          this.isPrivilegeCustomer = false;
          this.popupMobileCare();
        } else {
          this.isPrivilegeCustomer = true;
        }
      }
    });
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
      // ${this.mobileNoService.getMobileNo(form.mobileNo)}
      html: `หมายเลข สมัครบริการโมบายแคร์กับเครื่อง <br> Samsung Note 9 แล้ว
      <br> (แพ็กเกจ xxxxxx สิ้นสุด dd/mm/yyyy) <br> กรุณาเปลี่ยนเบอร์ใหม่ หรือยืนยันสมัครบริการโมบายแคร์กับ <br>
      เครื่อง Samsung S10 Plus <br> <div class="text-red">*บริการโมบายแคร์กับเครื่องเดิมจะสิ้นสุดทันที</div>`
    }).then((data) => {
      if (data.value && data.value === true) {
        this.sendOTP();
        this.isPrivilegeCustomer = true;
      } else {
        this.isPrivilegeCustomer = false;
        this.privilegeCustomerForm.get('mobileNo').setValue('');
      }
    });
  }

  sendOTP(): void {
    let mobile = this.customerInformationService.getSelectedMobileNo();
    if (environment.name !== 'PROD') {
      mobile = environment.TEST_OTP_MOBILE;
    }
    this.pageLoadingService.openLoading();
    this.http.post(`/api/customerportal/newRegister/${mobile}/sendOTP`, { digits: '5' }).toPromise()
      .then((resp: any) => {
        if (resp && resp.data) {
          this.transactionID = resp.data.transactionID;
          this.pageLoadingService.closeLoading();
        }
      }).catch((error) => {
        this.pageLoadingService.closeLoading();
        this.alertService.error(error);
      });
  }

  verifyOTP(): void {
    const otp = this.privilegeCustomerForm.value.otpNo;
    let mobile = this.customerInformationService.getSelectedMobileNo();
    if (environment.name !== 'PROD') {
      mobile = environment.TEST_OTP_MOBILE;
    }
    this.pageLoadingService.openLoading();
    this.http.post(`/api/customerportal/newRegister/${mobile}/verifyOTP`, { pwd: otp, transactionID: this.transactionID }).toPromise()
      .then((resp: any) => {
        if (resp && resp.data) {
          this.pageLoadingService.closeLoading();
          this.enableNextButton();
        } else {
          this.pageLoadingService.closeLoading();
          this.alertService.error('รหัส OTP ไม่ถูกต้อง กรุณาระบุใหม่อีกครั้ง');
          this.disableNextButton();
        }
      }).catch((error) => {
        this.pageLoadingService.closeLoading();
        this.alertService.error('รหัส OTP ไม่ถูกต้อง กรุณาระบุใหม่อีกครั้ง');
      });
  }
}
