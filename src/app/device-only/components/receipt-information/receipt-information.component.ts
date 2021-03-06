import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { AlertService, REGEX_MOBILE, ReceiptInfo, PageLoadingService } from 'mychannel-shared-libs';
import { TransactionAction, Customer } from 'src/app/shared/models/transaction.model';
import { BillingAddressService } from 'src/app/device-only/services/billing-address.service';
import { CustomerInformationService } from 'src/app/device-only/services/customer-information.service';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { API } from 'src/app/device-only/constants/api.constant';
@Component({
  selector: 'app-receipt-information-device-only',
  templateUrl: './receipt-information.component.html',
  styleUrls: ['./receipt-information.component.scss']
})
export class ReceiptInformationComponent implements OnInit {

  @Input()
  customerInfoTemp: any;

  @Output()
  completed: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  error: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  errorAddessValid: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  action: EventEmitter<string> = new EventEmitter<string>();

  customerInfo: any;

  customerBilling: any;

  searchByMobileNoForm: FormGroup;
  receiptInfoForm: FormGroup;
  billingAddressForm: FormGroup;
  customerAddress: any;
  isShowInputForKeyIn: boolean = false;
  amphurs: any;
  tumbols: any;
  nameText: string;
  billingAddressText: string;
  keyInCustomerAddressTemp: any;
  actionType: string;
  customerReadCardTemp: any;
  allZipCodes: any;

  readCardCustomerAddressTemp: any;
  titleNamesData: any;
  zipCodeData: any;
  provincesData: any;
  titleNames: any;
  zipCodesAllProvince: any;
  provinces: any;
  allProvinces: any;
  provincesName: any;
  zipCode: any;

  constructor(
    private fb: FormBuilder,
    private billingAddress: BillingAddressService,
    private customerInfoService: CustomerInformationService,
    private alertService: AlertService,
    private pageLoadingService: PageLoadingService
  ) {
  }

  ngOnInit(): void {

    this.callServiceGetTitleNames();
    this.callServiceGetProvinces();
    this.callServiceGetZipcodes();

    this.createReceiptForm();
    this.createSearchByMobileNoForm();

    this.customerAddress = {
      idCardNo: '',
      titleName: '',
      firstName: '',
      lastName: '',
      homeNo: '',
      moo: '',
      mooBan: '',
      room: '',
      floor: '',
      buildingName: '',
      soi: '',
      street: '',
      province: '',
      amphur: '',
      tumbol: '',
      zipCode: '',
    };

    this.billingAddress.getLocationName().then((resp: any) => this.receiptInfoForm.controls['branch'].setValue(resp.data.displayName));

    if (this.customerInfoTemp) {
      this.setDataFromCustomerInfoTemp();
    }
  }

  private setDataFromCustomerInfoTemp(): void {
    const customer = this.customerInfoTemp.customer;
    const billDeliveryAddress = this.customerInfoTemp.billDeliveryAddress;
    const receiptInfo = this.customerInfoTemp.receiptInfo;
    const mobileNo = this.customerInfoTemp.mobileNo;
    this.setCustomerInfo({
      customer: { ...customer, ...billDeliveryAddress, ...receiptInfo, ...mobileNo },
      action: this.customerInfoTemp.action
    });
    if (this.isShowInputForKeyIn) {
      this.keyInCustomerAddressTemp = { ...customer, ...billDeliveryAddress };
    }
    for (const item in receiptInfo) {
      if (receiptInfo.hasOwnProperty(item)) {
        this.receiptInfoForm.controls[item].setValue(receiptInfo[item]);
      }
    }
  }

  private createReceiptForm(): void {
    this.receiptInfoForm = this.fb.group({
      taxId: ['', [Validators.required]],
      branch: ['', []],
      buyer: ['', []],
      buyerAddress: ['', []],
      telNo: ['', [Validators.pattern(/^0[6-9]\d{8}$/), Validators.required]],
    });
    this.receiptInfoForm.valueChanges.pipe(debounceTime(750)).subscribe(event => {
      this.error.emit(this.receiptInfoForm.valid);
      if (this.receiptInfoForm.valid) {
        const receiptInfo: ReceiptInfo = this.receiptInfoForm.value;
        this.completed.emit({ ...this.customerInfo, receiptInfo });
      }
    });
  }

  private createSearchByMobileNoForm(): void {
    this.searchByMobileNoForm = new FormGroup({
      'mobileNo': new FormControl('', [
        Validators.maxLength(10),
        Validators.minLength(10),
        Validators.pattern('^(0)(6|8|9)[0-9]*$|^((88)(6|8|9)[0-9]*)$'),
        Validators.compose([Validators.required, Validators.pattern(REGEX_MOBILE)])
      ])
    });
  }

  keyPress(event: any): void {
    const charCode: number = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
  }

  setCustomerInfoReadCard(data: any): void {
    const customer: Customer = {
      firstNameEn: data.customer.firstNameEn || '',
      lastNameEn: data.customer.lastNameEn || '',
      issueDate: data.customer.issueDate || '',
      idCardNo: data.customer.idCardNo || '',
      idCardType: data.customer.idCardType || 'บัตรประชาชน',
      titleName: data.customer.titleName || '',
      firstName: data.customer.firstName || '',
      lastName: data.customer.lastName || '',
      birthdate: data.customer.birthdate || '',
      gender: data.customer.gender || '',
      expireDate: data.customer.expireDate || '',
      homeNo: data.customer.homeNo || '',
      moo: data.customer.moo || '',
      mooBan: data.customer.mooBan || '',
      room: data.customer.room || '',
      floor: data.customer.floor || '',
      buildingName: data.customer.buildingName || '',
      soi: data.customer.soi || '',
      street: data.customer.street || '',
      province: data.customer.province || '',
      amphur: data.customer.amphur || '',
      tumbol: data.customer.tumbol || '',
      zipCode: data.customer.zipCode || ''
    };
    this.readCardCustomerAddressTemp = customer;
    this.actionType = data.action;
    this.nameText = data.customer.titleName + ' ' + data.customer.firstName + ' ' + data.customer.lastName;
    this.billingAddressText = this.customerInfoService.convertBillingAddressToString(customer);
    this.allProvinces = this.provincesData;
  }

  setCustomerInfo(data: any): void {
    const customer: Customer = {
      idCardNo: data.customer.idCardNo,
      idCardType: data.customer.idCardType || 'บัตรประชาชน',
      titleName: data.customer.titleName,
      firstName: data.customer.firstName,
      lastName: data.customer.lastName,
      birthdate: data.customer.birthdate || '',
      gender: data.customer.gender || '',
      expireDate: data.customer.expireDate || '',
      homeNo: data.customer.homeNo,
      moo: data.customer.moo || '',
      mooBan: data.customer.mooBan || '',
      room: data.customer.room || '',
      floor: data.customer.floor || '',
      buildingName: data.customer.buildingName || '',
      soi: data.customer.soi || '',
      street: data.customer.street || '',
      province: data.customer.province,
      amphur: data.customer.amphur,
      tumbol: data.customer.tumbol,
      zipCode: data.customer.zipCode,
      // mobileNo: data.mobileNo,
    };
    this.action.emit(data.action);
    this.customerInfo = { customer };
    if (!this.customerReadCardTemp && data.action === TransactionAction.READ_CARD) {
      this.customerReadCardTemp = customer;
    }

    if (data.customer.idCardNo) {
      this.receiptInfoForm.controls['taxId'].setValue((`XXXXXXXXX${(data.customer.idCardNo.substring(9))}`));
    }

    if (data.mobileNo) {
      this.keyInCustomerAddressTemp = customer;
    }
    this.customerBilling = customer;

    this.actionType = data.action;
    this.nameText = data.customer.titleName + ' ' + data.customer.firstName + ' ' + data.customer.lastName;
    this.billingAddressText = this.customerInfoService.convertBillingAddressToString(customer);
    if (data.action === TransactionAction.READ_CARD || this.billingAddressText) {
      this.errorAddessValid.emit(true);
    }
    this.customerInfoService.setDisableReadCard();
  }

  private checkChargeType(mobileNo: string): void {
    this.customerInfoService.getProfileByMobileNo(mobileNo)
      .then((resp) => {
        const chargeType: string = resp.data.chargeType;
        switch (chargeType) {
          case 'Pre-paid':
            this.alertService.warning('กรุณาระบุเบอร์ AIS รายเดือนเท่านั้น');
            this.searchByMobileNoForm.controls['mobileNo'].setValue('');
            break;
          case 'Post-paid':
            this.customerInfoService.getBillingByMobileNo(mobileNo)
              .then((res: any) => {
                if (res && res.data && res.data.billingAddress) {
                  this.setCustomerInfo({
                    customer: this.customerInfoService.mapAttributeFromGetBill(res.data.billingAddress),
                    action: TransactionAction.KEY_IN,
                    mobileNo: mobileNo
                  });
                  this.allProvinces = this.provincesData;
                  this.errorAddessValid.emit(true);
                  this.customerInfoService.setSelectedMobileNo(mobileNo);
                  this.pageLoadingService.closeLoading();
                } else {
                  this.errorNotAisMobileNo();
                }
              })
              .catch(() => {
                this.pageLoadingService.closeLoading();
                this.errorNotAisMobileNo();
                this.clearData();
              });
            break;
        }
      })
      .catch(() => {
        this.pageLoadingService.closeLoading();
        this.errorNotAisMobileNo();
        this.clearData();
      });
  }

  private clearData(): void {
    this.searchByMobileNoForm.controls['mobileNo'].setValue('');
    this.nameText = '';
    this.billingAddressText = '';
    this.receiptInfoForm.controls['taxId'].setValue('');
  }

  private errorNotAisMobileNo(): void {
    this.alertService.notify({
      type: 'error',
      confirmButtonText: 'OK',
      showConfirmButton: true,
      text: 'เบอร์นี้ไม่ใช่ระบบ AIS กรุณาเปลี่ยนเบอร์ใหม่'
    });
  }

  searchCustomerInfo(): void {
    if (this.searchByMobileNoForm.valid) {
      this.pageLoadingService.openLoading();
      const mobileNo = this.searchByMobileNoForm.value.mobileNo;
      this.checkChargeType(mobileNo);
    } else {
      if (this.searchByMobileNoForm.controls.mobileNo.value.length === 10) {
        this.alertService.notify({
          type: 'warning',
          confirmButtonText: 'OK',
          showConfirmButton: true,
          text: 'กรุณาระบุเบอร์ให้ถูกต้อง'
        });
      } else {
        this.alertService.notify({
          type: 'warning',
          confirmButtonText: 'OK',
          showConfirmButton: true,
          text: 'กรุณาระบุเบอร์ให้ครบ 10 หลัก'
        });
      }
      this.nameText = '';
      this.billingAddressText = '';
      this.receiptInfoForm.controls['taxId'].setValue('');
    }
  }

  switchKeyInBillingAddress(): void {
    this.isShowInputForKeyIn = !this.isShowInputForKeyIn;
    this.billingAddress.setIsKeyInBillingAddress(this.isShowInputForKeyIn);

    if (this.isShowInputForKeyIn) {
      this.keyInCustomerAddressTemp = this.customerBilling;
      this.titleNames = this.titleNamesData;
      this.zipCodesAllProvince = this.zipCodeData;
      this.provinces = this.provincesName;
      this.allProvinces = this.provincesData;
    }
    if (this.receiptInfoForm.valid) {
      this.onError(true);
    }
  }

  callServiceGetTitleNames(): void {
    this.billingAddress.getTitleName().then((resp: any) => {
      this.titleNamesData = resp;
    });
  }

  callServiceGetProvinces(): void {
    this.billingAddress.getProvinces().then((resp: any) => {
      this.provincesData = resp;
      this.provincesName = this.provincesData.map((province: any) => province.name);
    });
  }

  callServiceGetZipcodes(): void {
    this.billingAddress.getZipCodes().then((resp: any) => {
      this.zipCodeData = resp;
    });
  }

  onCompleted(value: any): void {
    let action = TransactionAction.KEY_IN;
    if (!value.dirty && !value.touched && this.actionType === TransactionAction.READ_CARD) {
      action = TransactionAction.READ_CARD;
    }

    this.setCustomerInfo({
      customer: value,
      action: action
    });
    if (!value.idCardNo) {
      this.receiptInfoForm.controls['taxId'].setValue('');
    }
  }

  isDirtyCustomerInfoReadCard(value: any): any {
    const fields = ['amphur',
    'buildingName',
    'firstName',
    'floor',
    'homeNo',
    'idCardNo',
    'lastName',
    'moo',
    'mooBan',
    'province',
    'room',
    'soi',
    'street',
    'titleName',
    'tumbol',
    'zipCode'];
    fields.forEach((i) => {
       if (this.customerReadCardTemp && this.customerReadCardTemp[i] !== value[i]) {
        return false;
       }
    });
    return true;
  }

  onError(valid: boolean): void {
    this.errorAddessValid.emit(valid);
  }

  private assignProvinceAndZipCode(province: any, zipCode: string): void {
    this.customerAddress = Object.assign(Object.assign({}, this.customerAddress), {
      province: province.name,
      zipCode: zipCode
    });
  }

}
