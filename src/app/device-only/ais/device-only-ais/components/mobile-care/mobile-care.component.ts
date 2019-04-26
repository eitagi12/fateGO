import { Component, OnInit, Input, ViewChild, TemplateRef, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { WIZARD_DEVICE_ONLY_AIS } from '../../constants/wizard.constant';
import { AlertService, PageLoadingService, BillingSystemType } from 'mychannel-shared-libs';
import { CustomerInformationService } from '../../services/customer-information.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { HttpClient } from '../../../../../../../node_modules/@angular/common/http';
import { environment } from 'src/environments/environment';
import { TransactionService } from '../../../../../shared/services/transaction.service';
import { Transaction, MainPackage } from '../../../../../shared/models/transaction.model';
import { MobileCareService } from '../../services/mobile-care.service';
import { MOBILE_CARE_PACKAGE_KEY_REF } from '../../constants/cpc.constant';
import { log } from 'util';

export interface MobileCare {
  nextBillEffective?: boolean;
  existingMobileCare?: boolean;
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
  public currentPackageMobileCare: any[];
  public privilegeCustomerForm: FormGroup;
  private exMobileCare: any;
  mainPackage: MainPackage;
  billingSystem: string;
  mobileCareForm: FormGroup;
  notBuyMobileCareForm: FormGroup;
  priceOption: PriceOption;
  transaction: Transaction;
  transactionID: string;

  @Input() mobileCare: MobileCare;
  @Input() normalPrice: number;
  @Output() existingMobileCare: EventEmitter<any> = new EventEmitter<any>();
  @Output() completed: EventEmitter<any> = new EventEmitter<any>();
  @Output() isVerifyflag: EventEmitter<any> = new EventEmitter<any>();
  @Output() promotion: EventEmitter<any> = new EventEmitter<any>();
  @Output() verifyOtp: EventEmitter<any> = new EventEmitter<any>();
  @Output() checkBuyMobileCare: EventEmitter<any> = new EventEmitter<any>();
  @Output() isReasonNotBuyMobileCare: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('template')
  template: TemplateRef<any>;
  modalRef: BsModalRef;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private alertService: AlertService,
    private customerInformationService: CustomerInformationService,
    private priceOptionService: PriceOptionService,
    private http: HttpClient,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private mobileCareService: MobileCareService

  ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.createForm();
    this.oncheckValidators();
    this.checkillingSystem(this.privilegeCustomerForm.value.mobileNo);
    this.checkPrivilegeMobileCare(this.privilegeCustomerForm.value.mobileNo);
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
        this.mainPackage = this.mobileCareForm.value.promotion.value;
        this.promotion.emit(this.mobileCareForm.value.promotion.value);
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
  }

  public onNotBuyMobileCare(dismiss: boolean): void {
    if (dismiss) {
      this.mobileCareForm.patchValue({
        mobileCare: true
      });
    } else {
      this.isVerifyflag.emit(true);
      this.promotion.emit(this.notBuyMobileCareForm.value.notBuyMobile);
      this.existingMobileCare.emit(false);
    }
    this.modalRef.hide();
  }

  public checkillingSystem(mobileNo: string): void {
    this.customerInformationService.getProfileByMobileNo(mobileNo).then((res) => {
      this.billingSystem = res.data.billingSystem;
    });
  }

  public checkPrivilegeMobileCare(mobileNo: string): void {
    this.pageLoadingService.openLoading();
    if (mobileNo) {
      this.customerInformationService.getCustomerProfile(mobileNo).then((res) => {
        const mobileSegment = res.data.mobileSegment;
        this.callService(mobileSegment);
        this.pageLoadingService.closeLoading();
      }).catch(() => {
        this.pageLoadingService.closeLoading();
      });
    } else {
      this.pageLoadingService.closeLoading();
      this.callService();
    }
  }

  public searchMobileNo(): void {
    if (this.privilegeCustomerForm.value.mobileNo.length === 10) {
      this.checkExistingMobileCare(this.privilegeCustomerForm.value.mobileNo);
    } else {
      this.alertService.notify({
        type: 'warning',
        confirmButtonText: 'OK',
        showConfirmButton: true,
        text: 'กรุณาระบุเบอร์ให้ครบ 10 หลัก'
      });
    }
  }

  public checkExistingMobileCare(mobileNo: string): void {
    this.pageLoadingService.openLoading();
    if (mobileNo) {
      this.checkMobileCare(mobileNo).then(() => {
        this.customerInformationService.getCustomerProfile(mobileNo).then(res => {
          const mobileSegment = res.data.mobileSegment;
          this.callService(mobileSegment);
        });
        this.pageLoadingService.closeLoading();
      }).catch(() => {
        this.pageLoadingService.closeLoading();
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

  private checkMobileCare(mobileNo: string): Promise<any> {
    return this.customerInformationService.getBillingByMobileNo(mobileNo)
      .then((res: any) => {
        let indexExistingMobileCare: any;
        for (let index = 0; index < res.data.currentPackage.length; index++) {
          if (res.data.currentPackage[index].produuctGroup && res.data.currentPackage[index].produuctGroup === 'Mobile Care') {
            indexExistingMobileCare = index;
          }
        }

        if (indexExistingMobileCare >= 0) {
          this.currentPackageMobileCare = res.data.currentPackage[indexExistingMobileCare];
          this.isPrivilegeCustomer = false;
          this.http.get(`/api/customerportal/get-existing-mobile-care/${mobileNo}`).toPromise().then((response: any) => {
            this.exMobileCare = response.data;
            this.popupMobileCare(this.currentPackageMobileCare);
          });
        } else {
          this.pageLoadingService.closeLoading();
          this.currentPackageMobileCare = res.data.currentPackage;
          this.isPrivilegeCustomer = true;
          this.sendOTP();
        }
      });
  }

  private popupMobileCare(currentPackageMobileCare: any): void {
    const endDt = currentPackageMobileCare.endDt;
    const descThai = currentPackageMobileCare.descThai;
    const form = this.privilegeCustomerForm.getRawValue();
    this.alertService.notify({
      type: 'warning',
      width: '80%',
      cancelButtonText: 'เปลี่ยนเบอร์ใหม่',
      cancelButtonClass: 'btn-secondary btn-lg text-black mr-2',
      confirmButtonText: 'ยืนยันการสมัคร',
      confirmButtonClass: 'btn-success btn-lg text-white mr-2',
      showCancelButton: true,
      showConfirmButton: true,
      reverseButtons: true,
      allowEscapeKey: false,
      html: `หมายเลข ${this.mobileCareService.mobileNoPipe(form.mobileNo)} <br> สมัครบริการโมบายแคร์กับเครื่อง
      ${this.exMobileCare.existHandSet.brand} ${this.exMobileCare.existHandSet.model} แล้ว
      <br> (แพ็กเกจ ${descThai} <br> สิ้นสุด ${endDt}) <br> กรุณาเปลี่ยนเบอร์ใหม่ หรือยืนยันสมัครบริการโมบายแคร์กับ <br>
      เครื่อง ${this.priceOption.productDetail.brand} ${this.priceOption.productDetail.model} (เครื่องใหม่)<br>
      <div class="text-red">โดยบริการโมบายแคร์กับเครื่องเดิมจะสิ้นสุดทันที</div>`
    }).then((data) => {
      if (data.value && data.value === true) {
        this.existingMobileCare.emit(this.currentPackageMobileCare);
        this.sendOTP();
        this.isPrivilegeCustomer = true;
      } else {
        this.isPrivilegeCustomer = false;
        this.privilegeCustomerForm.get('mobileNo').setValue('');
      }
    });
  }

  public sendOTP(): void {
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

  public verifyOTP(): void {
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
          this.completed.emit({
            mobileNo: this.privilegeCustomerForm.value.mobileNo,
            billingSystem: this.billingSystem
          });
          this.isVerifyflag.emit(true);
        } else {
          this.pageLoadingService.closeLoading();
          this.alertService.error('รหัส OTP ไม่ถูกต้อง กรุณาระบุใหม่อีกครั้ง');
          this.isVerifyflag.emit(false);
        }
      }).catch((error) => {
        this.pageLoadingService.closeLoading();
        this.alertService.error('รหัส OTP ไม่ถูกต้อง กรุณาระบุใหม่อีกครั้ง');
      });
  }

  public callService(mobileSegment?: string): void {
    let billingSystem: string;
    if (this.billingSystem === 'Non BOS') {
      billingSystem = BillingSystemType.IRB;
    } else {
      billingSystem = this.billingSystem || BillingSystemType.IRB;
    }
    const chargeType = this.mainPackage ? this.mainPackage.customAttributes.billingSystem : 'Post-paid';
    const endUserPrice = +this.priceOption.trade.normalPrice;
    this.mobileCareService.getMobileCare({
      packageKeyRef: MOBILE_CARE_PACKAGE_KEY_REF,
      billingSystem: BillingSystemType.IRB
    }, chargeType, billingSystem, endUserPrice, mobileSegment)
      .then((mobileCare: any) => {
        this.mobileCare = {
          promotions: mobileCare
        };
        if (this.mobileCare.promotions && this.mobileCare.promotions.length > 0) {
          this.mobileCare.promotions[0].active = true;
        }
      })
      .then(() => mobileSegment ? null : this.pageLoadingService.closeLoading());
  }
}
