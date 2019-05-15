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
import { debounceTime } from 'rxjs/operators';

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
  isSelect: boolean;

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
    this.onCheckValidators();
    this.checkPrivilegeMobileCare();
    this.isSelect = false;
  }

  public onCheckValidators(): void {
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
        // check Verify to Pass & check selectPackage Mobilecare
        this.isVerifyflag.emit(false);
      }
      if (this.mobileCareForm.valid) {
        this.mainPackage = this.mobileCareForm.value.promotion.value;
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

    this.SelectReasonNotBuyMobileCare();
  }

  private SelectReasonNotBuyMobileCare(): void {
    this.notBuyMobileCareForm.valueChanges.subscribe((value: any) => {
      if (this.notBuyMobileCareForm.value.notBuyMobile !== '') {
        this.isSelect = true;
      } else {
        this.isSelect = false;
      }
    });
  }

  public onNotBuyMobileCare(dismiss: boolean): void {
    if (dismiss) {
      this.mobileCareForm.patchValue({
        mobileCare: true
      });
    } else {
      this.isVerifyflag.emit(true);
      this.isReasonNotBuyMobileCare.emit(this.notBuyMobileCareForm.value.notBuyMobile);
      this.existingMobileCare.emit(false);
    }
    this.modalRef.hide();
  }
  // เช็คเบอร์ตอนเข้าหน้า mobile
  public checkPrivilegeMobileCare(): void {
    const mobileNo = this.privilegeCustomerForm.value.mobileNo;
    this.pageLoadingService.openLoading();
    if (mobileNo) {
      // check billingSystem post paid
      this.customerInformationService.getProfileByMobileNo(mobileNo).then((res) => {
        this.billingSystem = res.data.billingSystem;
      });
      // check package mobile care serenade เอา mobileSegment(ขั้น serenade) ไปยิง callService
      this.customerInformationService.getCustomerProfile(mobileNo).then((res) => {
        const mobileSegment = res.data.mobileSegment;
        this.callService(mobileSegment, res.data.chargeType);
        this.pageLoadingService.closeLoading();
      });
    } else {
      this.callService();
    }
  }

  public searchMobileNo(): void {
    this.pageLoadingService.openLoading();
    this.checkExistingMobileCare();
  }

  public checkExistingMobileCare(): void {
    const mobileNo = this.privilegeCustomerForm.value.mobileNo;
    this.customerInformationService.getProfileByMobileNo(mobileNo)
      .then((res) => {
        switch (res.data.chargeType) {
          case 'Pre-paid':
            this.customerInformationService.getCustomerProfile(mobileNo).then((resp) => {
              const mobileSegment = resp.data.mobileSegment;
              this.callService(mobileSegment, res.data.chargeType);
              this.http.get(`/api/customerportal/get-existing-mobile-care/${mobileNo}`).toPromise()
                .then((result: any) => {
                  if (result.data.hasExistingMobileCare) {
                    this.exMobileCare = result.data;
                    this.popupMobileCare(result.data.existMobileCarePackage);
                  } else {
                    this.currentPackageMobileCare = result.data.existMobileCarePackage;
                    this.isPrivilegeCustomer = true;
                    this.sendOTP();
                  }
                });
            });

            break;
          case 'Post-paid':
            this.customerInformationService.getBillingByMobileNo(mobileNo)
              .then((result) => {
                if (result && result.data && result.data.billingAddress) {
                  this.checkMobileCare(mobileNo, result);
                  //
                  this.customerInformationService.getCustomerProfile(mobileNo)
                    .then((response) => {
                      const mobileSegment = response.data.mobileSegment;
                      this.callService(mobileSegment, res.data.chargeType);
                    })
                    .catch(() => {
                      this.alertService.notify({
                        type: 'error',
                        confirmButtonText: 'OK',
                        showConfirmButton: true,
                        text: 'เบอร์นี้ไม่ใช่ระบบ AIS กรุณาเปลี่ยนเบอร์ใหม่'
                      });
                      this.privilegeCustomerForm.controls['mobileNo'].setValue('');
                    });
                } else {
                  this.alertService.notify({
                    type: 'error',
                    confirmButtonText: 'OK',
                    showConfirmButton: true,
                    text: 'เบอร์นี้ไม่ใช่ระบบ AIS กรุณาเปลี่ยนเบอร์ใหม่'
                  });
                  this.privilegeCustomerForm.controls['mobileNo'].setValue('');
                }
              }).catch(() => {
                this.alertService.notify({
                  type: 'error',
                  confirmButtonText: 'OK',
                  showConfirmButton: true,
                  text: 'เบอร์นี้ไม่ใช่ระบบ AIS กรุณาเปลี่ยนเบอร์ใหม่'
                });
                this.privilegeCustomerForm.controls['mobileNo'].setValue('');
              });
            break;
        }
      })
      .catch(() => {
        this.alertService.notify({
          type: 'error',
          confirmButtonText: 'OK',
          showConfirmButton: true,
          text: 'เบอร์ไม่ถูกต้อง'
        });
        this.privilegeCustomerForm.controls['mobileNo'].setValue('');
      });
  }

  private checkMobileCare(mobileNo: string, response: any): void {
    let indexExistingMobileCare: any;
    if (response.data.currentPackage) {
      for (let index = 0; index < response.data.currentPackage.length; index++) {
        if (response.data.currentPackage[index].produuctGroup && response.data.currentPackage[index].produuctGroup === 'Mobile Care') {
          indexExistingMobileCare = index;
        }
      }
    }
    if (indexExistingMobileCare >= 0) {
      this.currentPackageMobileCare = response.data.currentPackage[indexExistingMobileCare];
      this.isPrivilegeCustomer = false;
      this.http.get(`/api/customerportal/get-existing-mobile-care/${mobileNo}`).toPromise().then((respons: any) => {
        this.exMobileCare = respons.data;
        this.popupMobileCare(this.currentPackageMobileCare);
      });
    } else {
      this.currentPackageMobileCare = response.data.currentPackage;
      this.isPrivilegeCustomer = true;
      this.sendOTP();
    }
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
        this.privilegeCustomerForm.controls['mobileNo'].setValue('');
      }
    });
  }

  public sendOTP(): void {
    console.log('sent');

    let mobile = this.customerInformationService.getSelectedMobileNo();
    if (environment.name !== 'PROD') {
      mobile = environment.TEST_OTP_MOBILE;
    }
    this.pageLoadingService.openLoading();
    this.http.post(`/api/customerportal/newRegister/${mobile}/sendOTP`, { digits: '5' }).toPromise()
      .then((resp: any) => {
        console.log(resp);

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

  public callService(mobileSegment?: string, chargeTypes?: any): void {
    let billingSystem: string;
    if (this.billingSystem === 'Non BOS') {
      billingSystem = BillingSystemType.IRB;
    } else {
      billingSystem = this.billingSystem || BillingSystemType.IRB;
    }
    console.log('billingSystem: ', billingSystem);
    const chargeType = chargeTypes ? chargeTypes : 'Post-paid';
    console.log(chargeType);
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
