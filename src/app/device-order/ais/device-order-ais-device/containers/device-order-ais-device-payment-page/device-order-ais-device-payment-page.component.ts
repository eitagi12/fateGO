import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, ShoppingCart, PaymentDetail, PaymentDetailBank, ReceiptInfo, Utils, TokenService, PageLoadingService, REGEX_MOBILE, AlertService, ReadCard, ReadCardService, ReadCardProfile, ReadCardEvent } from 'mychannel-shared-libs';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Transaction, Customer } from 'src/app/shared/models/transaction.model';
import { PriceOptionUtils } from 'src/app/shared/utils/price-option-utils';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { HttpClient } from '@angular/common/http';
import { WIZARD_DEVICE_ODER_AIS_DEVICE } from 'src/app/device-order/constants/wizard.constant';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ROUTE_DEVICE_AIS_DEVICE_EDIT_BILLING_ADDRESS_PAGE, ROUTE_DEVICE_AIS_DEVICE_SUMMARY_PAGE } from 'src/app/device-order/ais/device-order-ais-device/constants/route-path.constant';
import { Subscription, zip } from 'rxjs';
import { BsModalService, BsModalRef, isArray } from 'ngx-bootstrap';
import { BillingAccount } from '../../../device-order-ais-mnp/containers/device-order-ais-mnp-effective-start-date-page/device-order-ais-mnp-effective-start-date-page.component';
@Component({
  selector: 'app-device-order-ais-device-payment-page',
  templateUrl: './device-order-ais-device-payment-page.component.html',
  styleUrls: ['./device-order-ais-device-payment-page.component.scss']
})
export class DeviceOrderAisDevicePaymentPageComponent implements OnInit, OnDestroy {
  @ViewChild('selectBillAddTemplate')
  selectBillAddTemplate: any;
  modalRef: BsModalRef;

  selectBillingAddressForm: FormGroup;
  selectBillingAddrVal: string;

  shoppingCart: ShoppingCart;
  priceOption: PriceOption;
  transaction: Transaction;
  wizards: string[] = WIZARD_DEVICE_ODER_AIS_DEVICE;
  payementDetail: PaymentDetail;
  banks: PaymentDetailBank[];
  paymentDetailValid: boolean;

  paymentDetailTemp: any;
  receiptInfoTemp: any;
  receiptInfoForm: FormGroup;
  searchByMobileNoForm: FormGroup;
  receiptInfo: ReceiptInfo;
  receiptInfoValid: boolean;
  nameText: string;
  billingAddressText: string;
  idCardCustomerAddress: string;

  readCardSubscription: Subscription;
  readCard: ReadCard;
  customerProfile: ReadCardProfile;
  progressReadCard: number;
  dataReadIdCard: any;
  isReadCardError: boolean;
  billingAddress: string;
  location: string;
  billingAccountList: BillingAccount;

  cardStatus: string;
  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private utils: Utils,
    private http: HttpClient,
    private tokenService: TokenService,
    private pageLoadingService: PageLoadingService,
    private fb: FormBuilder,
    private alertService: AlertService,
    private readCardService: ReadCardService,
    private modalService: BsModalService,
  ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.createForm();
    this.createSearchByMobileNoForm();
    this.createSelectBillAddForm();
    this.checkLocation();

    const productDetail = this.priceOption.productDetail || {};
    const productStock = this.priceOption.productStock || {};
    const customer: any = this.transaction.data.customer || {};
    const trade: any = this.priceOption.trade || {};
    const advancePay: any = trade.advancePay || {};
    let commercialName = productDetail.name;
    if (productStock.color) {
      commercialName += ` สี ${productStock.color}`;
    }

    this.payementDetail = {
      commercialName: commercialName,
      promotionPrice: +(trade.promotionPrice || 0),
      isFullPayment: this.isFullPayment(),
      advancePay: +(advancePay.amount || 0),
    };

    this.banks = trade.banks || [];

    if (!this.banks.length) {
      // ถ้าไม่มี bank ให้ get bank จาก location ร้าน
      this.pageLoadingService.openLoading();
      this.http.post(`/api/salesportal/banks-promotion`, {
        location: this.tokenService.getUser().locationCode
      }).toPromise()
        .then((resp: any) => {
          this.pageLoadingService.closeLoading();
          this.banks = resp.data;
          this.priceOption.trade.banks = resp.data;
        })
        .catch(() => {
          this.pageLoadingService.closeLoading();
        })
        ;
    }
    this.createReceiptInfo(customer);
    this.checkBillFormChanged();
  }
  checkLocation(): void {
    const user = this.tokenService.getUser();
    this.http.get(`/api/salesportal/location-by-code?code=${user.locationCode}`).toPromise().then((code: any) => {
      const displayName: any = code && code.data && code.data.displayName ? code.data.displayName : {};
      this.receiptInfoForm.controls['branch'].setValue(displayName);
    });
  }
  // component payment
  onPaymentCompleted(payment: any): void {
    this.paymentDetailTemp = payment;
  }
  isFullPayment(): boolean {
    const trade = this.priceOption.trade || {};
    const payment = (trade.payments || []).find(p => p.method !== 'PP') || {};
    switch (payment.method) {
      case 'CC':
        if (PriceOptionUtils.getInstallmentsFromTrades([trade])) {
          return false;
        } else {
          return true;
        }
      case 'CA':
      case 'CA/CC':
      default:
        return true;
    }
  }
  onPaymentError(valid: boolean): void {
    this.paymentDetailValid = valid;
  }

  isNext(): boolean {
    return this.paymentDetailValid;
  }
  createReceiptInfo(customer: Customer): void {
    const receiptInfo: any = this.transaction.data.receiptInfo || {};
    this.receiptInfo = {
      taxId: customer.idCardNo,
      branch: '',
      buyer: `${customer.titleName} ${customer.firstName} ${customer.lastName}`,
      buyerAddress: this.getCustomerAddressStr(customer),
      telNo: receiptInfo.telNo
    };
  }

  checkBillFormChanged(): void {
    this.selectBillingAddressForm.valueChanges.subscribe((form: any) => {
      console.log(form);
      this.selectBillingAddrVal = form.billingAddress;
    });
  }

  createSelectBillAddForm(): void {
    this.selectBillingAddressForm = this.fb.group({
      billingAddress: ['', []]
    });
  }

  createForm(): void {
    this.receiptInfoForm = this.fb.group({
      taxId: ['', []],
      branch: ['', []],
      buyer: ['', []],
      buyerAddress: ['', []],
      telNo: ['', [Validators.pattern(REGEX_MOBILE)]]
    });
  }

  createSearchByMobileNoForm(): void {
    this.searchByMobileNoForm = this.fb.group({
      'mobileNo': ['', Validators.compose([Validators.required, Validators.maxLength(10)])],
    });
  }

  searchCustomerInfo(): void {
    console.log('this.searchByMobileNoForm.valid', this.searchByMobileNoForm.valid);
    if (this.searchByMobileNoForm.valid) {
      // this.pageLoadingService.openLoading();
      const mobileNo = this.searchByMobileNoForm.value.mobileNo;
      if (/88[0-9]{8}/.test(mobileNo)) {
        this.checkMobileFbb(mobileNo);
      } else {
        this.checkMobileStatus(mobileNo);
      }
    } else {
      this.alertService.notify({
        type: 'warning',
        confirmButtonText: 'OK',
        showConfirmButton: true,
        text: 'กรุณาระบุเบอร์ให้ครบ 10 หลัก'
      });
    }
  }

  checkMobileStatus(mobileNo: string): Promise<any> {
    this.pageLoadingService.openLoading();
    return this.http.get(`/api/customerportal/asset/${mobileNo}/profile`).toPromise()
      .then((res: any) => {
        const mobileStatus = res && res.data && res.data.mobileStatus ? res.data.mobileStatus : {};
        console.log('mobileStatus', mobileStatus);
        if (mobileStatus === 'Active') {
          return this.http.get(`/api/customerportal/billing/${mobileNo}`).toPromise().then((bill: any) => {
            const billing = bill && bill.data && bill.data.billingAddress ? bill.data.billingAddress : {};
            console.log('billing', billing);
            this.transaction.data.customer = billing;
            this.receiptInfo.buyer = billing.titleName + ' ' + billing.firstName + ' ' + billing.lastName;
            this.receiptInfo.taxId = billing.idCardNo;
            this.receiptInfoForm.controls['taxId'].setValue(this.receiptInfo.taxId);
            const customerAddr: Customer = {
              idCardNo: billing.idCardNo || '',
              birthdate: '',
              gender: '',
              idCardType: billing.idCardType || '',
              titleName: billing.titleName || '',
              firstName: billing.firstName || '',
              lastName: billing.lastName || '',
              homeNo: billing.houseNumber || '',
              moo: billing.moo || '',
              mooBan: billing.mooban || '',
              floor: billing.floor || '',
              buildingName: billing.buildingName || '',
              soi: billing.soi || '',
              tumbol: billing.tumbol,
              amphur: billing.amphur || '',
              province: billing.provinceName || '',
              zipCode: billing.portalCode || '',
              street: billing.streetName || ''
            };
            const buyerAddress = this.getCustomerAddressStr(customerAddr);
            this.receiptInfo.buyerAddress = buyerAddress;
          }).catch(() => {
            this.alertService.error('CATCH');
          });
        }
      }).then(() => {
        this.pageLoadingService.closeLoading();
      });
  }

  checkMobileFbb(mobileNo: string): Promise<any> {
    this.pageLoadingService.openLoading();
    console.log('fbb', mobileNo);
    return this.http.post(`/api/customerportal/query-fbb-info`, {
      inOption: '3',
      inMobileNo: mobileNo,
    }).toPromise()
      .then((response: any) => {
        const mobileFbb = response
          && response.data
          && response.data.billingProfiles[0]
          && response.data.billingProfiles[0] ? response.data.billingProfiles[0] : {};
        console.log('mobileFbb', mobileFbb);
        return this.http.get(`/api/customerportal/newRegister/${mobileFbb.caNo}/queryCustomerInfoAccount`)
          .toPromise().then((profile: any) => {
            const customerprofile = profile && profile.data && profile.data ? profile.data : {};
            const billing = customerprofile.address ? customerprofile.address : {};
            console.log('profile', customerprofile.address);
            this.transaction.data.customer = billing;
            this.receiptInfo.buyer = customerprofile.accntTitle + ' ' + customerprofile.name;
            this.receiptInfo.taxId = mobileFbb.baNo;
            this.receiptInfoForm.controls['taxId'].setValue(this.receiptInfo.taxId);
            const customerAddr: Customer = {
              idCardNo: billing.idCardNo || '',
              birthdate: '',
              gender: '',
              idCardType: billing.idCardType || '',
              titleName: billing.titleName || '',
              firstName: billing.firstName || '',
              lastName: billing.lastName || '',
              homeNo: billing.houseNumber || '',
              moo: billing.moo || '',
              mooBan: billing.mooban || '',
              floor: billing.floor || '',
              buildingName: billing.buildingName || '',
              soi: billing.soi || '',
              tumbol: billing.tumbol,
              amphur: billing.amphur || '',
              province: billing.provinceName || '',
              zipCode: billing.zipCode || '',
              street: billing.streetName || ''
            };
            const buyerAddress = this.getCustomerAddressStr(customerAddr);
            this.receiptInfo.buyerAddress = buyerAddress;
          }).catch(() => {
            this.alertService.error('CATHC');
          });
        // console.log('response', mobileFbb);
        // this.receiptInfo.buyer = mobileFbb.caName;
        // this.receiptInfo.buyerAddress = mobileFbb.installAddress;
        // this.receiptInfo.taxId =  mobileFbb.baNo;
        // this.receiptInfoForm.controls['taxId'].setValue(this.receiptInfo.taxId);
        // console.log('mobileFbb', this.receiptInfo.buyer);
        // console.log('mobileFbb', this.receiptInfo.buyerAddress);
      }).then(() => {
        this.pageLoadingService.closeLoading();
      });
  }
  readCardProcess(): void {
    delete this.dataReadIdCard;
    this.readCardSubscription = this.readCardService.onReadCard().subscribe((readCard: ReadCard) => {
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
        this.pageLoadingService.openLoading();
        this.getAllProvince().then((resp: any) => {
          const data = resp.data;
          let provinces = [];
          provinces = provinces ? data.provinces : [];
          return provinces;
        }).then((provinces: any) => {
          const provinceMap = provinces.find((province: any) => province.name === this.customerProfile.province);
          return this.http.get('api/customerportal/newRegister/queryZipcode', {
            params: {
              provinceId: provinceMap ? provinceMap.id : '',
              amphurName: this.customerProfile.amphur,
              tumbolName: this.customerProfile.tumbol
            }
          }).toPromise();
        }).then((resp: any) => {
          this.pageLoadingService.closeLoading();
          const data = resp.data;
          const zipCode = data.zipcodes ? data.zipcodes[0] : '';
          this.idCardCustomerAddress = this.getCustomerAddressStr(this.customerProfile, zipCode);
          this.dataReadIdCard = readCard.profile.idCardNo;
          this.http.get(`/api/customerportal/newRegister/${this.dataReadIdCard}/queryBillingAccount`).toPromise()
            .then((resps: any) => {
              const billList = resps.data && resps.data.billingAccountList || {};
              this.billingAccountList = billList.filter((bill: any) => {
                return bill.mobileNo[0] && bill.mobileNo;
              });
              this.onOpenModal();
            });
        }).catch((err: any) => {
          this.pageLoadingService.closeLoading();
          this.alertService.error(err);
        });

      }

    });
  }
  selectBillingAddress(): void {
    if (this.selectBillingAddrVal) {
      console.log('IF');
      const isnum: boolean = /^\d+$/.test(this.selectBillingAddrVal) || false;
      if (isnum) {
        const billingAccount: BillingAccount = this.billingAccountList[this.selectBillingAddrVal] || {};
        this.pageLoadingService.openLoading();
        const mobileNo = billingAccount.mobileNo[0] || '';
        this.http.get(`api/customerportal/billing/${mobileNo}`).toPromise().then((resp: any) => {
          const data = resp.data;
          const billingAddress = data.billingAddress || {};
          const customer: Customer = {
            idCardNo: billingAddress.idCardNo || '',
            birthdate: '',
            gender: '',
            idCardType: billingAddress.idCardType || '',
            titleName: billingAddress.titleName || '',
            firstName: billingAddress.firstName || '',
            lastName: billingAddress.lastName || '',
            homeNo: billingAddress.houseNumber || '',
            moo: billingAddress.moo || '',
            mooBan: billingAddress.mooban || '',
            floor: billingAddress.floor || '',
            buildingName: billingAddress.buildingName || '',
            soi: billingAddress.soi || '',
            tumbol: billingAddress.tumbol,
            amphur: billingAddress.amphur || '',
            province: billingAddress.provinceName || '',
            zipCode: billingAddress.portalCode || '',
            street: billingAddress.streetName || ''
          };
          this.receiptInfo.buyerAddress = this.getCustomerAddressStr(customer) || '';
          this.receiptInfo.buyer = `${customer.titleName} ${customer.firstName} ${customer.lastName}`;
          this.pageLoadingService.closeLoading();
          this.modalRef.hide();
        }).catch((err: any) => {
          this.alertService.error('CATCH');
          this.pageLoadingService.closeLoading();
          this.modalRef.hide();
        });
      } else {
        this.receiptInfo.buyer = `${this.customerProfile.titleName} ${this.customerProfile.firstName} ${this.customerProfile.lastName}`;
        this.receiptInfo.buyerAddress = this.selectBillingAddrVal || '';
        this.modalRef.hide();
      }
    } else {
      console.log('ELSE');
      console.log(this.selectBillingAddrVal);
    }

  }

  getCustomerAddressStr(customer: any, zipcode?: string): string {
    return this.utils.getCurrentAddress({
      homeNo: customer.homeNo || '',
      moo: customer.moo || '',
      mooBan: customer.mooBan || '',
      room: customer.room || '',
      floor: customer.floor || '',
      buildingName: customer.buildingName || '',
      soi: customer.soi || '',
      street: customer.street || '',
      tumbol: customer.tumbol || '',
      amphur: customer.amphur || '',
      province: customer.province || '',
      zipCode: customer.zipCode ? customer.zipCode : zipcode
    });
  }

  getAllProvince(): Promise<any> {
    return this.http.get('/api/customerportal/newRegister/getAllProvinces').toPromise();
  }

  get onReadCardProgress(): boolean {
    return this.readCard ? this.readCard.progress > 0 && this.readCard.progress < 100 : false;
  }

  editAddress(): void {
    this.router.navigate([ROUTE_DEVICE_AIS_DEVICE_EDIT_BILLING_ADDRESS_PAGE]);
  }

  onNext(): void {
    this.transaction.data.payment = this.paymentDetailTemp.payment;
    this.transaction.data.advancePayment = this.paymentDetailTemp.advancePayment;
    this.transaction.data.receiptInfo = this.receiptInfo;
    this.router.navigate([ROUTE_DEVICE_AIS_DEVICE_SUMMARY_PAGE]);
  }

  onBack(): void {
    // this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_CUSTOMER_INFO_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onOpenModal(): void {
    this.modalRef = this.modalService.show(this.selectBillAddTemplate, { class: 'pt-5 mt-5' });
  }

  closeModalSelectAddress(): void {
    this.modalRef.hide();
  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy(): void {
    if (this.readCardSubscription) {
      this.readCardSubscription.unsubscribe();
    }
    this.priceOptionService.update(this.priceOption);
    this.transactionService.update(this.transaction);
  }

  // private createTransaction(): void {
  //   this.transaction = {
  //     data: {
  //       transactionType: TransactionType.ORDER_MNP,
  //       action: null,
  //     }
  //   };
  // }
}
