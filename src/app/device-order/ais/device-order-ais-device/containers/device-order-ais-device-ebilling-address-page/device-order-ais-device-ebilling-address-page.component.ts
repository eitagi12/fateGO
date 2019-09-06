import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, CustomerAddress, CustomerService, AlertService, ReadCardService, ReadCard, ReadCardProfile, ReadCardEvent } from 'mychannel-shared-libs';
import {
  ROUTE_ORDER_NEW_REGISTER_CONFIRM_USER_INFORMATION_PAGE
} from 'src/app/order/order-new-register/constants/route-path.constant';
import { HttpClient } from '@angular/common/http';
import { Transaction, TransactionAction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { NgxResource, LocalStorageService } from 'ngx-store';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { WIZARD_DEVICE_ODER_AIS_DEVICE } from 'src/app/device-order/constants/wizard.constant';
import { ROUTE_DEVICE_AIS_DEVICE_PAYMENT_PAGE } from 'src/app/device-order/ais/device-order-ais-device/constants/route-path.constant';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';

@Component({
  selector: 'app-device-order-ais-device-ebilling-address-page',
  templateUrl: './device-order-ais-device-ebilling-address-page.component.html',
  styleUrls: ['./device-order-ais-device-ebilling-address-page.component.scss']
})
export class DeviceOrderAisDeviceEbillingAddressPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_DEVICE_ODER_AIS_DEVICE;

  transaction: Transaction;
  priceOption: PriceOption;
  customerAddress: CustomerAddress;
  allZipCodes: string[];
  provinces: any[];
  amphurs: string[];
  tumbols: string[];
  zipCodes: string[];
  prefixes: string[] = [];

  customerAddressTemp: CustomerAddress;
  billDeliveryAddress: CustomerAddress;
  translationSubscribe: Subscription;

  ebillingAddressValid: boolean;
  validateCustomerKeyInForm: FormGroup;
  customerInfo: any;

  readCardSubscription: Subscription;
  isReadCard: boolean = false;
  isReadCardError: boolean;
  progressReadCard: number;
  customerProfile: ReadCardProfile;
  readCard: ReadCard;
  dataReadIdCard: any;
  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private translation: TranslateService,
    private customerService: CustomerService,
    public fb: FormBuilder,
    private alertService: AlertService,
    private readCardService: ReadCardService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    if (this.transaction && this.transaction.data && this.transaction.data.order && this.transaction.data.order.soId) {
      this.homeService.callback = () => {
        this.alertService.question('ต้องการยกเลิกรายการขายหรือไม่ การยกเลิก ระบบจะคืนสินค้าเข้าสต๊อคสาขาทันที', 'ตกลง', 'ยกเลิก')
          .then((response: any) => {
            if (response.value === true) {
              this.returnStock().then(() => {
                this.transaction.data.order = {};
                this.transactionService.remove();
                window.location.href = '/';
              });
            }
          });
      };
    }
  }

  ngOnInit(): void {
    this.callService();
    this.createForm();
    const customer: any = this.transaction.data && this.transaction.data.customer ? this.transaction.data.customer : {};
    this.translationSubscribe = this.translation.onLangChange.pipe(debounceTime(750)).subscribe(() => {
      this.callService();
      this.amphurs = [];
      this.tumbols = [];
      this.zipCodes = [];
      this.customerAddress.amphur = null;
      this.customerAddress.tumbol = null;
      this.customerAddress.province = null;
    });
    this.customerInfo = {
      firstName: customer.firstName,
      lastName: customer.lastName,
      idCardNo: customer.idCardNo,
      prefix: customer.titleName,
    };
  }

  callService(): void {
    const customer: any = this.transaction.data && this.transaction.data.customer ? this.transaction.data.customer : {};
    this.http.get('/api/customerportal/newRegister/getAllZipcodes').subscribe((resp: any) => {
      this.allZipCodes = resp.data.zipcodes || [];
    });

    this.http.get('/api/customerportal/newRegister/getAllProvinces',
      {
        params: {
          provinceSubType: this.translation.currentLang === 'TH' ? 'THA' : 'ENG'
        }
      }).subscribe((resp: any) => {
        this.provinces = (resp.data.provinces || []);
        this.customerAddress = {
          homeNo: customer.homeNo,
          moo: customer.moo,
          mooBan: customer.mooBan,
          room: customer.room,
          floor: customer.floor,
          buildingName: customer.buildingName,
          soi: customer.soi,
          street: customer.street,
          province: customer.province,
          amphur: customer.amphur,
          tumbol: customer.tumbol,
          zipCode: customer.zipCode,
        };
      });
    this.customerService.queryTitleName().then((resp: any) => {
      if (this.transaction && this.transaction.data && this.transaction.data.customer) {
        this.prefixes = [this.transaction.data.customer.titleName];
      } else {
        this.prefixes = (resp.data.titleNames || []).map((prefix: any) => prefix);
      }
    });
  }

  createForm(): void {
    const customer: any = this.transaction.data && this.transaction.data.customer ? this.transaction.data.customer : {};
    const customValidate = this.defaultValidate;
    this.validateCustomerKeyInForm = this.fb.group({
      idCardNo: [{ value: customer.idCardNo || '', disabled: this.checkIdCardNo() },
      [Validators.pattern(/^[1-8]\d{12}$/), customValidate.bind(this)]],
      prefix: [customer.titleName || '', [Validators.required]],
      firstName: [customer.firstName || '', [Validators.required]],
      lastName: [customer.lastName || '', [Validators.required]],
    });
  }

  checkIdCardNo(): boolean {
    const customer = this.transaction.data && this.transaction.data.customer && this.transaction.data.customer.idCardNo;
    const actionReadCard = (this.transaction.data && this.transaction.data.action &&
      (this.transaction.data.action === TransactionAction.READ_CARD));
    if (customer && actionReadCard) {
      return true;
    } else {
      return false;
    }
  }

  defaultValidate(): ValidationErrors | null {
    const customer = this.transaction.data
      && this.transaction.data.customer
      && this.transaction.data.customer.idCardNo ? this.transaction.data.customer.idCardNo : {};
    if (!customer) {
      return {
        message: 'กรุณากรอกรูปแบบให้ถูกต้อง'
      };
    }
  }

  getProvinces(): string[] {
    return (this.provinces || []).map((province: any) => {
      return province.name;
    });
  }

  getProvinceByName(provinceName: string): any {
    return (this.provinces || []).find((prov: any) => prov.name === provinceName) || {};
  }

  onProvinceSelected(params: any): void {
    const province = this.getProvinceByName(params.provinceName);
    const req = {
      provinceId: province.id
    };

    this.http.get('/api/customerportal/newRegister/queryAmphur', {
      params: req
    }).subscribe((resp: any) => {
      this.amphurs = (resp.data.amphurs || []).map((amphur: any) => {
        return amphur;
      });
    });
  }

  onAmphurSelected(params: any): void {
    const province = this.getProvinceByName(params.provinceName);
    const req = {
      provinceId: province.id,
      amphurName: params.amphurName
    };

    this.http.get('/api/customerportal/newRegister/queryTumbol', {
      params: req
    }).subscribe((resp: any) => {
      this.tumbols = (resp.data.tumbols || []).map((tumbol: any) => {
        return tumbol;
      });
    });
  }

  onTumbolSelected(params: any): void {
    const province = this.getProvinceByName(params.provinceName);
    this.http.get('/api/customerportal/newRegister/queryZipcode', {
      params: {
        provinceId: province.id,
        amphurName: params.amphurName,
        tumbolName: params.tumbolName
      }
    }).subscribe((resp: any) => {
      this.zipCodes = resp.data.zipcodes || [];
    });
  }

  onZipCodeSelected(zipCode: string): void {
    this.http.get('/api/customerportal/newRegister/getProvinceIdByZipcode', {
      params: { zipcode: zipCode }
    }).toPromise()
      .then((resp: any) => {
        const province = this.provinces.find((prov: any) => prov.id === resp.data.provinceId);
        if (!province) {
          return;
        }
        this.customerAddress = Object.assign(
          Object.assign({}, this.customerAddress),
          {
            province: province.name,
            zipCode: zipCode
          }
        );
      });
  }

  onCompleted(value: any): void {
    this.customerAddressTemp = value;
  }

  onError(valid: boolean): void {
    this.ebillingAddressValid = valid;
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_AIS_DEVICE_PAYMENT_PAGE], { queryParams: { ebilling: true } });
  }

  onNext(): void {
    const customer = this.transaction.data.customer;
    this.transaction.data.customer = Object.assign(
      Object.assign({}, customer),
      this.customerAddressTemp
    );

    this.transaction.data.customer.titleName = this.validateCustomerKeyInForm.value.prefix;
    this.transaction.data.customer.firstName = this.validateCustomerKeyInForm.value.firstName;
    this.transaction.data.customer.lastName = this.validateCustomerKeyInForm.value.lastName;
    this.transaction.data.customer.idCardNo = this.validateCustomerKeyInForm.value.idCardNo || customer.idCardNo;
    this.router.navigate([ROUTE_DEVICE_AIS_DEVICE_PAYMENT_PAGE], { queryParams: { ebilling: true } });
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  returnStock(): Promise<void> {
    return new Promise(resolve => {
      const transaction = this.transactionService.load();
      const promiseAll = [];
      if (transaction.data) {
        if (transaction.data.order && transaction.data.order.soId) {
          const order = this.http.post('/api/salesportal/device-sell/item/clear-temp-stock', {
            location: this.priceOption.productStock.location,
            soId: transaction.data.order.soId,
            transactionId: transaction.transactionId
          }).toPromise().catch(() => Promise.resolve());
          promiseAll.push(order);
        }
      }
      Promise.all(promiseAll).then(() => resolve());
    });
  }

  ngOnDestroy(): void {
    this.translationSubscribe.unsubscribe();
    this.transactionService.update(this.transaction);
  }

  readCardProcess(): void {
    this.isReadCard = true;
    delete this.dataReadIdCard;
    this.readCardService.onReadCard().subscribe((readCard: ReadCard) => {
      this.readCard = readCard;
      this.progressReadCard = readCard.progress;
      const valid = !!(readCard.progress >= 100 && readCard.profile);
      if (readCard.error) {
        this.customerProfile = null;
      }

      if (readCard.eventName === ReadCardEvent.EVENT_CARD_LOAD_ERROR) {
        this.isReadCardError = valid;
      }

      if (valid && !this.dataReadIdCard) {
        this.customerProfile = readCard.profile;
        this.validateCustomerKeyInForm.patchValue({
          idCardNo: readCard.profile.idCardNo || '',
          prefix: readCard.profile.titleName || '',
          firstName: readCard.profile.firstName || '',
          lastName: readCard.profile.lastName || '',
        });
        if (readCard.profile.titleName) {
          this.prefixes = [readCard.profile.titleName];
        }
        this.getAllProvince().then((resp: any) => {
          this.callService();
          this.amphurs = [];
          this.tumbols = [];
          this.zipCodes = [];
          this.customerAddress.amphur = null;
          this.customerAddress.tumbol = null;
          this.customerAddress.province = null;
          let provinces = [];
          provinces = provinces ? resp.data.provinces : [];
          const provinceMap = provinces.find((province: any) => province.name === readCard.profile.province);
          return this.http.get('/api/customerportal/newRegister/queryZipcode', {
            params: {
              provinceId: provinceMap ? provinceMap.id : '',
              amphurName: readCard.profile.amphur,
              tumbolName: readCard.profile.tumbol
            }
          }).toPromise().then((response: any) => {
            this.customerAddress = {
              homeNo: readCard.profile.homeNo,
              moo: readCard.profile.moo,
              mooBan: '',
              room: '',
              floor: '',
              buildingName: '',
              soi: readCard.profile.soi,
              street: readCard.profile.street,
              province: readCard.profile.province,
              amphur: readCard.profile.amphur,
              tumbol: readCard.profile.tumbol,
              zipCode: response.data && response.data.zipcodes ? response.data.zipcodes[0] : '',
            };
          });
        });
      }
    });
  }

  getAllProvince(): Promise<any> {
    return this.http.get('/api/customerportal/newRegister/getAllProvinces').toPromise();
  }

  get onReadCardProgress(): boolean {
    return this.readCard ? this.readCard.progress > 0 && this.readCard.progress < 100 : false;
  }
}
