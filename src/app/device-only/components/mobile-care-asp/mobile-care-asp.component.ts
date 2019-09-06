import { Component, OnInit, Input, ViewChild, TemplateRef, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { AlertService, PageLoadingService, BillingSystemType } from 'mychannel-shared-libs';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from '../../../shared/services/transaction.service';
import { Transaction, MainPackage } from '../../../shared/models/transaction.model';
import { WIZARD_DEVICE_ONLY_AIS } from '../../constants/wizard.constant';
import { MOBILE_CARE_PACKAGE_KEY_REF } from '../../constants/cpc.constant';
import { CustomerInformationService } from 'src/app/device-only/services/customer-information.service';
import { MobileCareService } from 'src/app/device-only/services/mobile-care.service';
import { ROUTE_DEVICE_ONLY_ASP_READ_CARD_PAGE } from '../../asp/device-only-asp/constants/route-path.constant';

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
  selector: 'app-mobile-care-asp',
  templateUrl: './mobile-care-asp.component.html',
  styleUrls: ['./mobile-care-asp.component.scss'],
  providers: []
})

export class MobileCareAspComponent implements OnInit {
  wizards: string[] = WIZARD_DEVICE_ONLY_AIS;
  public moblieNo: string;
  public mobileNoPost: string;
  public VAT: number = 1.07;
  public currentPackageMobileCare: any[];
  public privilegeCustomerForm: FormGroup;
  private exMobileCare: any;
  private chargeType: any;
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
  @Input() selected: any;
  @Output() existingMobileCare: EventEmitter<any> = new EventEmitter<any>();
  @Output() completed: EventEmitter<any> = new EventEmitter<any>();
  @Output() mobileNoEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() isVerifyflag: EventEmitter<any> = new EventEmitter<any>();
  @Output() promotion: EventEmitter<any> = new EventEmitter<any>();
  @Output() verifyOtp: EventEmitter<any> = new EventEmitter<any>();
  @Output() checkBuyMobileCare: EventEmitter<any> = new EventEmitter<any>();
  @Output() isReasonNotBuyMobileCare: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('template')
  template: TemplateRef<any>;
  modalRef: BsModalRef;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private alertService: AlertService,
    private customerInformationService: CustomerInformationService,
    private priceOptionService: PriceOptionService,
    private http: HttpClient,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private mobileCareService: MobileCareService,
    private customerInfoService: CustomerInformationService
  ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.createForm();
    this.checkValidators();
    this.checkVerifyNext();
    this.checkPrivilegeMobileCare();
    this.isSelect = false;
  }

  public checkValidators(): void {
    let mobileNoDefault = this.customerInformationService.getSelectedMobileNo();
    mobileNoDefault = mobileNoDefault ? mobileNoDefault : '';
    this.privilegeCustomerForm = new FormGroup({
      'mobileNo': new FormControl(mobileNoDefault, [
        Validators.maxLength(10),
        Validators.minLength(10),
        Validators.pattern('^(0)(6|8|9)[0-9]*$|^((88)(6|8|9)[0-9]*)$'),
        Validators.required,
      ])
    });
    this.checkValidateMobileNo(mobileNoDefault);
  }

  private checkValidateMobileNo(mobileNoDefault: string): void {
    const isAddressReadCard = this.customerInfoService.getAddressReadCard();
    if (this.transaction.data.action === 'READ_CARD' && mobileNoDefault === '') {
      if (!mobileNoDefault || mobileNoDefault === '') {
        this.promotion.emit(undefined);
        this.isVerifyflag.emit(false);
        this.privilegeCustomerForm.controls['mobileNo'].enable();
        this.privilegeCustomerForm.controls.mobileNo.valueChanges.subscribe(() => {
          if (this.privilegeCustomerForm.controls['mobileNo'].value.length === 10) {
            this.searchMobileNo();
          }
        });
      }
    } else if (this.transaction.data.action === 'READ_CARD' && mobileNoDefault !== '') {
      if ((isAddressReadCard === true) && (typeof(this.transaction.data.mobileCarePackage) === 'string')) {
        this.promotion.emit(undefined);
        this.isVerifyflag.emit(false);
        this.privilegeCustomerForm.controls['mobileNo'].setValue('');
        this.privilegeCustomerForm.controls['mobileNo'].enable();
        this.privilegeCustomerForm.controls.mobileNo.valueChanges.subscribe(() => {
          if (this.privilegeCustomerForm.controls['mobileNo'].value.length === 10) {
            this.searchMobileNo();
          }
        });
      } else {
        this.promotion.emit(undefined);
        this.isVerifyflag.emit(false);
        this.privilegeCustomerForm.controls['mobileNo'].disable();
        this.searchMobileNo();
      }
    } else {
      this.promotion.emit(undefined);
      this.isVerifyflag.emit(false);
      this.privilegeCustomerForm.controls['mobileNo'].disable();
      this.searchMobileNo();
    }
  }

  public keyPress(event: any): void {
    const charCode: number = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
  }

  public createForm(): void {
    let mobileCare = '';
    let notMobileCare = '';
    if (this.selected && typeof this.selected === 'object') {
      mobileCare = this.selected;
    }

    if (this.selected && typeof this.selected === 'string') {
      notMobileCare = this.selected;
    }
    this.mobileCareForm = this.formBuilder.group({
      'mobileCare': [true, Validators.required],
      'promotion': [mobileCare, Validators.required]
    });

    this.notBuyMobileCareForm = this.formBuilder.group({
      'notBuyMobile': [notMobileCare],
    });

    this.mobileCareForm.valueChanges.subscribe((value: any) => {
      if (!value.mobileCare) {
        return this.onOpenNotBuyMobileCare();
      } else {
        this.notBuyMobileCareForm.patchValue({
          notBuyMobile: ''
        });
        this.promotion.emit(this.mobileCareForm.value.promotion.value);
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
      this.completed.emit(this.notBuyMobileCareForm.value.notBuyMobile);
    }
    this.modalRef.hide();
  }
  // เช็คเบอร์ตอนเข้าหน้า mobile
  public checkPrivilegeMobileCare(): void {
    const mobileNo = this.privilegeCustomerForm.value.mobileNo;
    if (mobileNo) {
      // check billingSystem post paid
      this.customerInformationService.getProfileByMobileNo(mobileNo).then((res) => {
        this.billingSystem = res.data.billingSystem;
      });
      // check package mobile care serenade เอา mobileSegment(ขั้น serenade) ไปยิง callService
      this.customerInformationService.getCustomerProfile(mobileNo).then((res) => {
        const mobileSegment = res.data.mobileSegment;
        this.callService(mobileSegment, res.data.chargeType);
      });
    } else {
      this.callService();
    }
  }

  public searchMobileNo(): void {
    this.pageLoadingService.openLoading();
    this.promotion.emit(undefined);
    this.checkExistingMobileCare();
    this.isVerifyflag.emit(false);
  }

  public checkExistingMobileCare(): void {
    const mobileNo = this.privilegeCustomerForm.controls['mobileNo'].value;
    this.customerInformationService.getProfileByMobileNo(mobileNo)
      .then((res) => {
        this.billingSystem = res.data.billingSystem;
        this.chargeType = res.data.chargeType;
        switch (res.data.chargeType) {
          case 'Pre-paid':
            this.customerInformationService.getCustomerProfile(mobileNo).then((resp) => {
              const mobileSegment = resp.data.mobileSegment;
              this.callService(mobileSegment, res.data.chargeType);
              this.http.get(`/api/customerportal/get-existing-mobile-care/${mobileNo}`).toPromise()
                .then((result: any) => {
                  if (result.data.hasExistingMobileCare) {
                    this.exMobileCare = result.data;
                    this.currentPackageMobileCare = result.data.existMobileCarePackage;
                    this.popupMobileCare(this.currentPackageMobileCare);
                  } else {
                    this.existingMobileCare.emit(this.currentPackageMobileCare);
                    this.mobileNoEmit.emit({
                      mobileNo: this.privilegeCustomerForm.value.mobileNo,
                      billingSystem: this.billingSystem,
                      chargeType: this.chargeType
                    });
                    this.isVerifyflag.emit(true);
                    this.pageLoadingService.closeLoading();
                    this.currentPackageMobileCare = result.data.existMobileCarePackage;
                  }
                });
            });
            break;
          case 'Post-paid':
            this.customerInformationService.getBillingByMobileNo(mobileNo)
              .then((result) => {
                if (result && result.data && result.data.billingAddress) {
                  this.checkMobileCare(mobileNo, result);
                  this.customerInformationService.getCustomerProfile(mobileNo)
                    .then((response) => {
                      if (response.data.mobileStatus === 'Active') {
                        const mobileSegment = response.data.mobileSegment;
                        this.callService(mobileSegment, res.data.chargeType);
                      } else {
                        this.alertService.notify({
                          type: 'error',
                          confirmButtonText: 'OK',
                          showConfirmButton: true,
                          text: 'เบอร์ไม่ถูกต้อง กรุณาเปลี่ยนเบอร์ใหม่'
                        });
                      }
                    })
                    .catch(() => {
                      this.alertService.notify({
                        type: 'error',
                        confirmButtonText: 'OK',
                        showConfirmButton: true,
                        text: 'ไม่สามารถทำรายการได้ในขณะนี้'
                      });
                    });
                } else {
                  this.alertService.notify({
                    type: 'error',
                    confirmButtonText: 'OK',
                    showConfirmButton: true,
                    text: 'เบอร์ไม่ถูกต้อง กรุณาเปลี่ยนเบอร์ใหม่'
                  });
                  this.privilegeCustomerForm.controls['mobileNo'].setValue('');
                }
              }).catch(() => {
                this.alertService.notify({
                  type: 'error',
                  confirmButtonText: 'OK',
                  showConfirmButton: true,
                  text: 'ไม่สามารถทำรายการได้ในขณะนี้'
                });
              });
            break;
        }
      })
      .catch((err) => {
        if (err && err.error && err.error.developerMessage === 'Error: ESOCKETTIMEDOUT') {
          this.alertService.notify({
            type: 'error',
            confirmButtonText: 'OK',
            showConfirmButton: true,
            text: 'ไม่สามารถทำรายการได้ในขณะนี้'
          });
        } else {
          if (this.privilegeCustomerForm.valid) {
            this.alertService.notify({
              type: 'warning',
              confirmButtonText: 'OK',
              showConfirmButton: true,
              text: 'เบอร์นี้ไม่ใช่ระบบ AIS ไม่สามารถซื้อโมบายแคร์ได้'
            });
            // เลือก ReadCard และเป็นเบอร์ Ais
            const isChargeType = this.customerInfoService.getChargeType();
            const isAddressReadCard = this.customerInfoService.getAddressReadCard();
            // if (this.customerInfoService.isNonAis === 'AIS' && isAddressReadCard === true) {
            //   this.mobileNoEmit.emit({
            //     mobileNo: ''
            //   });
            //   this.customerInfoService.setChargeType('');
            // }

            if (this.customerInfoService.isNonAis === 'AIS' && isAddressReadCard === true) {
              if (this.transaction.data && this.transaction.data.mobileCarePackage) {
                this.mobileNoEmit.emit({
                  mobileNo: ''
                });
                this.customerInfoService.setChargeType('');
              }
            }

          } else {
            this.alertService.notify({
              type: 'error',
              confirmButtonText: 'OK',
              showConfirmButton: true,
              text: 'เบอร์ไม่ถูกต้อง กรุณาเปลี่ยนเบอร์ใหม่'
            });
            this.privilegeCustomerForm.controls['mobileNo'].setValue('');
          }
        }
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
      this.http.get(`/api/customerportal/get-existing-mobile-care/${mobileNo}`).toPromise().then((respons: any) => {
        this.exMobileCare = respons.data;
        this.popupMobileCare(this.currentPackageMobileCare);
      });
    } else {
      this.mobileNoEmit.emit({
        mobileNo: this.privilegeCustomerForm.value.mobileNo,
        billingSystem: this.billingSystem,
        chargeType: this.chargeType
      });
      this.isVerifyflag.emit(true);
      this.currentPackageMobileCare = response.data.currentPackage;
      this.pageLoadingService.closeLoading();
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
        this.isVerifyflag.emit(false);
        this.checkVerifyNext();
        this.pageLoadingService.closeLoading();
      } else {
        const isAddressReadCard = this.customerInfoService.getAddressReadCard();
        if (this.transaction.data.action === 'READ_CARD' && isAddressReadCard === true) {
          this.customerInformationService.setSelectedMobileNo('');
          this.privilegeCustomerForm.controls['mobileNo'].setValue('');
        }
        this.router.navigate([ROUTE_DEVICE_ONLY_ASP_READ_CARD_PAGE]);
        this.pageLoadingService.closeLoading();
      }
    });
  }

  private checkVerifyNext(): void {
    if (this.privilegeCustomerForm.value.mobileNo) {
      this.existingMobileCare.emit(this.currentPackageMobileCare);
      this.mobileNoEmit.emit({
        mobileNo: this.privilegeCustomerForm.value.mobileNo,
        billingSystem: this.billingSystem,
        chargeType: this.chargeType
      });
      this.isVerifyflag.emit(true);
    } else {
      this.isVerifyflag.emit(false);
    }
  }

  public callService(mobileSegment?: string, chargeTypes?: any): void {
    const chargeType = chargeTypes ? chargeTypes : 'Post-paid';
    const endUserPrice = +this.priceOption.trade.normalPrice;
    let billingSystem: string;

    if (this.billingSystem === 'Non BOS') {
      billingSystem = BillingSystemType.IRB;
    } else {
      billingSystem = this.billingSystem || BillingSystemType.IRB;
    }
    this.mobileCareService.getMobileCare({
      packageKeyRef: MOBILE_CARE_PACKAGE_KEY_REF,
      billingSystem,
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
