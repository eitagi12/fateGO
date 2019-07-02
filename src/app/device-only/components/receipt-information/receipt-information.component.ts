import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { AlertService, REGEX_MOBILE, ReceiptInfo, PageLoadingService } from 'mychannel-shared-libs';
import { TransactionAction, Customer } from 'src/app/shared/models/transaction.model';
import { BillingAddressService } from 'src/app/device-only/services/billing-address.service';
import { CustomerInformationService } from 'src/app/device-only/services/customer-information.service';

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
  searchByMobileNoForm: FormGroup;
  receiptInfoForm: FormGroup;
  billingAddressForm: FormGroup;
  customerAddress: any;
  isShowInputForKeyIn: boolean;
  titleName: any;
  provinces: any;
  allZipCodes: any;
  amphurs: any;
  tumbols: any;
  zipCode: any;
  nameText: string;
  billingAddressText: string;
  keyInCustomerAddressTemp: any;

  constructor(
    private fb: FormBuilder,
    private billingAddress: BillingAddressService,
    private customerInfoService: CustomerInformationService,
    private alertService: AlertService,
    private pageLoadingService: PageLoadingService
  ) {
    this.isShowInputForKeyIn = this.billingAddress.getIsKeyInBillingAddress();
    this.billingAddress.getTitleName().then(this.responseTitleNames());
    this.billingAddress.getProvinces().then(this.responseProvinces());
    this.billingAddress.getZipCodes().then(this.responseZipCodes());
  }

  ngOnInit(): void {
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
    this.createForm();
    this.createSearchByMobileNoForm();
    this.billingAddress.getLocationName()
      .subscribe((resp) => this.receiptInfoForm.controls['branch'].setValue(resp.data.displayName));
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

  private createForm(): void {
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
        if (this.isShowInputForKeyIn) {
          this.nameText = '';
          this.billingAddressText = '';
        }
      }
    });
  }

  private createSearchByMobileNoForm(): void {
    this.searchByMobileNoForm = this.fb.group({
      mobileNo: ['', Validators.compose([Validators.required, Validators.pattern(REGEX_MOBILE)])]
    });
  }

  keyPress(event: any): void {
    const charCode: number = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
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
      mobileNo: data.mobileNo
    };
    this.action.emit(data.action);
    this.customerInfo = { customer };
    this.receiptInfoForm.controls['taxId'].setValue(data.customer.idCardNo);
    this.keyInCustomerAddressTemp = customer;
    this.billingAddress.getLocationName()
      .subscribe((resp) => this.receiptInfoForm.controls['branch'].setValue(resp.data.displayName));
    this.nameText = data.customer.titleName + ' ' + data.customer.firstName + ' ' + data.customer.lastName;
    this.billingAddressText = this.customerInfoService.convertBillingAddressToString(customer);
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
            this.action.emit(TransactionAction.KEY_IN);
            break;
          case 'Post-paid':
            this.customerInfoService.getBillingByMobileNo(mobileNo)
              .then((res: any) => {
                if (res && res.data && res.data.billingAddress) {
                  this.setCustomerInfo({
                    customer: this.customerInfoService.mapAttributeFromGetBill(res.data.billingAddress),
                    action: TransactionAction.KEY_IN
                  });
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
    this.receiptInfoForm.controls['branch'].setValue('');
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
      this.alertService.notify({
        type: 'warning',
        confirmButtonText: 'OK',
        showConfirmButton: true,
        text: 'กรุณาระบุเบอร์ให้ครบ 10 หลัก'
      });
      this.nameText = '';
      this.billingAddressText = '';
      this.receiptInfoForm.controls['taxId'].setValue('');
      this.receiptInfoForm.controls['branch'].setValue('');
    }
  }

  switchKeyInBillingAddress(): void {
    const isShowInput = !this.isShowInputForKeyIn;
    this.billingAddress.setIsKeyInBillingAddress(isShowInput);
    this.isShowInputForKeyIn = isShowInput;
    if (this.receiptInfoForm.valid) {
      this.onError(true);
    }
  }

  onProvinceSelected(params: any): void {
    const province = this.findProvinceByName(params.provinceName);
    const req = {
      provinceId: province.id,
      zipcode: params.zipCode
    };
    if (!params.zipCode) {
      delete req.zipcode;
    }
    this.billingAddress.getAmphurs(req).then(this.responseAmphur());
  }

  onAmphurSelected(params: any): void {
    const province = this.findProvinceByName(params.provinceName);
    const req = {
      provinceId: province.id,
      amphurName: params.amphurName,
      zipcode: params.zipCode
    };
    if (!params.zipCode) {
      delete req.zipcode;
    }
    this.billingAddress.getTumbols(req).then(this.responseTumbols());
  }

  onTumbolSelected(params: any): void {
    const province = this.findProvinceByName(params.provinceName);
    const req = {
      provinceId: province.id,
      amphurName: params.amphurName,
      tumbolName: params.tumbolName
    };
    this.billingAddress.queryZipCode(req).then(this.responseZipCode());
  }

  onZipCodeSelected(zipCode: string): void {
    this.billingAddress.getProvinceIdByZipCode(zipCode).then(provinceId => {
      const province = this.findProvinceByProvinceID(provinceId);
      if (!province) { return; }
      this.assignProvinceAndZipCode(province, zipCode);
    });
  }

  onCompleted(value: any): void {
    this.setCustomerInfo({
      customer: value,
      action: TransactionAction.KEY_IN
    });
    this.receiptInfoForm.controls['taxId'].setValue(value.idCardNo);
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

  private findProvinceByName(provinceName: string): any {
    return (this.provinces || []).find((prov: any) => prov.name === provinceName) || {};
  }

  private findProvinceByProvinceID(provinceId: string): any {
    return this.provinces.find((prov: any) => prov.id === provinceId);
  }

  private getProvinces(): string[] {
    return (this.provinces || []).map((province: any) => province.name);
  }

  private responseTitleNames(): (value: any) => any {
    return (resp: string[]) => this.titleName = resp;
  }

  private responseZipCode(): (value: any) => any {
    return (resp: any) => this.zipCode = resp;
  }

  private responseTumbols(): (value: any) => any {
    return (resp: string[]) => this.tumbols = resp;
  }

  private responseAmphur(): (value: any) => any {
    return (resp: string[]) => this.amphurs = resp;
  }

  private responseZipCodes(): (value: any) => any {
    return (resp: string[]) => this.allZipCodes = resp;
  }

  private responseProvinces(): (value: any) => any {
    return (resp: string[]) => this.provinces = resp;
  }
  private responseTelNo(): AbstractControl {
    return this.receiptInfoForm.controls['telNo'];
  }
}
