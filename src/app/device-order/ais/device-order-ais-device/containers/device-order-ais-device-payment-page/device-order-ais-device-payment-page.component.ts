import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HomeService, ShoppingCart, PaymentDetail, PaymentDetailBank, ReceiptInfo, Utils, TokenService, PageLoadingService, REGEX_MOBILE, AlertService, ReadCard, ReadCardService, ReadCardProfile, ReadCardEvent, User } from 'mychannel-shared-libs';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Transaction, Customer, TransactionType, TransactionAction } from 'src/app/shared/models/transaction.model';
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
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';
import { ROUTE_BUY_PRODUCT_CAMPAIGN_PAGE } from 'src/app/buy-product/constants/route-path.constant';
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
  mobileNo: any;
  cardStatus: string;
  user: User;
  zipCode: string;
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
    private sharedTransactionService: SharedTransactionService,
    private route: ActivatedRoute
  ) {
    this.user = this.tokenService.getUser();
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();
    this.homeService.callback = () => {
      this.alertService.question('ท่านต้องการยกเลิกการซื้อสินค้าหรือไม่')
        .then((data: any) => {
          if (!data.value) {
            return false;
          }

          // Returns stock (sim card, soId) todo...
          return this.returnStock().then(() => true);
        });
    };
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      console.log('params', params.ebilling); // {order: "popular"}
      if (!params.ebilling) {
        console.log('create');
        this.createTransaction();
      }
    });
    this.checkLocation();
    this.createForm();
    this.createSearchByMobileNoForm();
    this.createSelectBillAddForm();
    const productDetail = this.priceOption.productDetail || {};
    const productStock = this.priceOption.productStock || {};
    // tslint:disable-next-line:max-line-length
    const billingInformation: any = this.transaction.data && this.transaction.data.billingInformation ? this.transaction.data.billingInformation : {};
    const customerProfile: any = this.transaction.data && this.transaction.data.customer ? this.transaction.data.customer : {};
    const customer: any = billingInformation.billDeliveryAddress || customerProfile;
    console.log('customer ngOnInit', customer);
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
  createForm(): void {
    // tslint:disable-next-line:max-line-length
    const billingInformation: any = this.transaction.data && this.transaction.data.billingInformation ? this.transaction.data.billingInformation : {};
    const customerProfile: any = this.transaction.data && this.transaction.data.customer ? this.transaction.data.customer : {};
    const customer: any = billingInformation.billDeliveryAddress || customerProfile;
    // tslint:disable-next-line:max-line-length
    const telNo = this.transaction.data && this.transaction.data.receiptInfo && this.transaction.data.receiptInfo.telNo ? this.transaction.data.receiptInfo.telNo : '';
    console.log('create cus', customer);
    this.receiptInfoForm = this.fb.group({
      taxId: ['', []],
      branch: ['', []],
      buyer: ['', []],
      buyerAddress: ['', []],
      telNo: ['', [Validators.pattern(REGEX_MOBILE)]]
    });
    this.receiptInfoForm.patchValue({
      taxId: customer.idCardNo || '',
      telNo: telNo,
      // tslint:disable-next-line:max-line-length
      buyer: customer.titleName + ' ' + customer.firstName + ' ' + customer.lastName || '',
      buyerAddress: this.utils.getCurrentAddress({
        homeNo: customer.homeNo,
        moo: customer.moo,
        mooBan: customer.mooBan,
        room: customer.room,
        floor: customer.floor,
        buildingName: customer.buildingName,
        soi: customer.soi,
        street: customer.street,
        tumbol: customer.tumbol,
        amphur: customer.amphur,
        province: customer.province,
        zipCode: customer.zipCode,
      }),
    });
    console.log('this.transaction.data.receiptInfo', this.transaction.data.receiptInfo);
    console.log('this.receiptInfoForm', this.receiptInfoForm.value.buyer);
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
    console.log('this.paymentDetailTemp', this.paymentDetailTemp);
  }
  isFullPayment(): boolean {
    const trade = this.priceOption.trade || {};
    const payment = (trade.payments || []).find(p => p.method !== 'PP') || {};
    console.log('trade', trade);
    console.log('payment', payment);
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
    const billingInformation = this.transaction.data &&
      this.transaction.data.billingInformation ? this.transaction.data.billingInformation : {};
    const customerProfile: any = this.transaction.data && this.transaction.data.customer ? this.transaction.data.customer : {};
    const customerAddress: any = billingInformation.billDeliveryAddress || customerProfile;
    const receiptInfo: any = this.transaction.data && this.transaction.data.receiptInfo ? this.transaction.data.receiptInfo : {};
    console.log('customerAddress', customerAddress);
    this.receiptInfo = {
      taxId: customerAddress.idCardNo,
      branch: '',
      buyer: customerAddress.titleName
        ? customerAddress.titleName + ' ' + customerAddress.firstName + ' ' + customerAddress.lastName || ''
        : '-',
      buyerAddress: this.utils.getCurrentAddress({
        homeNo: customerAddress.homeNo,
        moo: customerAddress.moo,
        mooBan: customerAddress.mooBan,
        room: customerAddress.room,
        floor: customerAddress.floor,
        buildingName: customerAddress.buildingName,
        soi: customerAddress.soi,
        street: customerAddress.street,
        tumbol: customerAddress.tumbol,
        amphur: customerAddress.amphur,
        province: customerAddress.province,
        zipCode: customerAddress.zipCode,
      }),
      telNo: receiptInfo.telNo
    };
    console.log('receiptInfo', this.receiptInfo);
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
    console.log('checkmobile');
    this.pageLoadingService.openLoading();
    return this.http.get(`/api/customerportal/asset/${mobileNo}/profile`).toPromise()
      .then((res: any) => {
        const mobileStatus = res && res.data && res.data.mobileStatus ? res.data.mobileStatus : '';
        console.log('mobileStatus', mobileStatus);
        if (mobileStatus === 'Active') {
          return this.http.get(`/api/customerportal/billing/${mobileNo}`).toPromise()
            .then((bill: any) => {
              const billing = bill && bill.data && bill.data.billingAddress ? bill.data.billingAddress : '';
              console.log('billing', bill.data.billingAddress);
              this.transaction.data.customer = {
                homeNo: billing.houseNumber || '',
                zipCode: billing.portalCode || '',
                province: billing.provinceName || '',
                street: billing.streetName || '',
                amphur: billing.amphur || '',
                buildingName: billing.buildingName || '',
                firstName: billing.firstName || '',
                floor: billing.floor || '',
                idCardNo: billing.idCardNo || '',
                idCardType: billing.idCardType || '',
                lastName: billing.lastName || '',
                moo: billing.moo || '',
                mooBan: billing.mooban || '',
                soi: billing.soi || '',
                titleName: billing.titleName || '',
                tumbol: billing.tumbol || '',
                birthdate: '',
                gender: ''
              };
              console.log('this.transaction.data.customer', this.transaction.data.customer);
              this.receiptInfo.buyer = billing.titleName + ' ' + billing.firstName + ' ' + billing.lastName;
              this.receiptInfo.taxId = billing.idCardNo;
              this.receiptInfo.buyerAddress = this.utils.getCurrentAddress({
                homeNo: billing.houseNumber || '',
                moo: billing.moo || '',
                mooBan: billing.mooban || '',
                room: billing.room,
                floor: billing.floor || '',
                buildingName: billing.buildingName || '',
                soi: billing.soi || '',
                street: billing.streetName || '',
                tumbol: billing.tumbol,
                amphur: billing.amphur || '',
                province: billing.provinceName || '',
                zipCode: billing.portalCode || '',
              });
              this.receiptInfoForm.controls['taxId'].setValue(this.receiptInfo.taxId);
              console.log('this.receiptInfo', this.receiptInfo);
              // tslint:disable-next-line:max-line-length
              if (this.transaction.data && this.transaction.data.billingInformation && this.transaction.data.billingInformation.billDeliveryAddress) {
                delete this.transaction.data.billingInformation.billDeliveryAddress;
              }
              console.log('this.receiptInfo.buyerAddress ', this.receiptInfo.buyerAddress);
              this.transaction.data.receiptInfo = this.receiptInfo;
              this.transaction.data.action = TransactionAction.SEARCH;
            }).catch((err) => {
              console.log('catch mobile', err);
              this.router.navigate([ROUTE_DEVICE_AIS_DEVICE_EDIT_BILLING_ADDRESS_PAGE]);
            });
        }
      }).catch((error) => {
        console.log('catch mobile', error);
        this.router.navigate([ROUTE_DEVICE_AIS_DEVICE_EDIT_BILLING_ADDRESS_PAGE]);
      }).then(() => {
        this.transactionService.save(this.transaction);
        this.mobileNo = mobileNo;
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
            const customerprofile = profile && profile.data && profile.data ? profile.data : '';
            const billing = customerprofile.address ? customerprofile.address : '';
            const customerName = mobileFbb.caName.split(' ');
            console.log('billing', billing);
            // data ที่ return ไม่เหมือนกับ transaction
            this.transaction.data.customer = {
              homeNo: billing.houseNo || '',
              zipCode: billing.zipCode || '',
              province: billing.provinceName || '',
              street: billing.streetName || '',
              amphur: billing.amphur || '',
              buildingName: billing.buildingName || '',
              firstName: customerName[0] || '',
              floor: billing.floor || '',
              idCardNo: mobileFbb.baNo || '',
              idCardType: billing.idCardType || '',
              lastName: customerName[1] || '',
              moo: billing.moo || '',
              mooBan: billing.mooban || '',
              soi: billing.soi || '',
              titleName: customerprofile.accntTitle || '',
              tumbol: billing.tumbol || '',
              room: billing.room || '',
              birthdate: '',
              gender: '',
            };
            this.receiptInfo.taxId = mobileFbb.baNo;
            this.receiptInfo.buyer = customerprofile.accntTitle + ' ' + customerprofile.name;
            // this.receiptInfoForm.controls['taxId'].setValue(this.receiptInfo.taxId);
            this.receiptInfo.buyerAddress = this.utils.getCurrentAddress({
              homeNo: billing.houseNumber || '',
              moo: billing.moo || '',
              mooBan: billing.mooban || '',
              room: billing.room,
              floor: billing.floor || '',
              buildingName: billing.buildingName || '',
              soi: billing.soi || '',
              street: billing.streetName || '',
              tumbol: billing.tumbol,
              amphur: billing.amphur || '',
              province: billing.provinceName || '',
              zipCode: billing.portalCode || '',
            });
            // tslint:disable-next-line:max-line-length
            if (this.transaction.data && this.transaction.data.billingInformation && this.transaction.data.billingInformation.billDeliveryAddress) {
              delete this.transaction.data.billingInformation.billDeliveryAddress;
            }
            this.transaction.data.action = TransactionAction.SEARCH;
          }).catch((error) => {
            console.log('catch mobile', error);
            this.router.navigate([ROUTE_DEVICE_AIS_DEVICE_EDIT_BILLING_ADDRESS_PAGE]);
          });
      }).catch((err) => {
        console.log('catch mobile', err);
        this.router.navigate([ROUTE_DEVICE_AIS_DEVICE_EDIT_BILLING_ADDRESS_PAGE]);
      })
      .then(() => {
        this.mobileNo = mobileNo;
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
          this.zipCode = data.zipcodes ? data.zipcodes[0] : '';
          console.log('cus', this.customerProfile);
          console.log('zipCode', this.zipCode);
          this.idCardCustomerAddress = this.getCustomerAddressStr(this.customerProfile, this.zipCode);
          this.dataReadIdCard = this.customerProfile.idCardNo;
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
        });

      }

    });
  }
  selectBillingAddress(): void {
    if (this.selectBillingAddrVal) {
      console.log('IF');
      const isnum: boolean = /^\d+$/.test(this.selectBillingAddrVal) || false;
      if (isnum) {
        console.log('isnum');
        const billingAccount: BillingAccount = this.billingAccountList[this.selectBillingAddrVal] || {};
        this.pageLoadingService.openLoading();
        const mobileNo = billingAccount.mobileNo[0] || '';
        this.http.get(`api/customerportal/billing/${mobileNo}`).toPromise().then((resp: any) => {
          const data = resp.data;
          const billing = data.billingAddress || {};
          console.log('billingAddress', billing);
          this.transaction.data.customer = {
            homeNo: billing.houseNumber || '',
            zipCode: billing.portalCode || '',
            province: billing.provinceName || '',
            street: billing.streetName || '',
            amphur: billing.amphur || '',
            buildingName: billing.buildingName || '',
            firstName: billing.firstName || '',
            floor: billing.floor || '',
            idCardNo: billing.idCardNo || '',
            idCardType: billing.idCardType || '',
            lastName: billing.lastName || '',
            moo: billing.moo || '',
            mooBan: billing.mooban || '',
            soi: billing.soi || '',
            titleName: billing.titleName || '',
            tumbol: billing.tumbol || '',
            birthdate: '',
            gender: '',
          };
          this.receiptInfo.taxId = billing.baNo;
          this.receiptInfo.buyer = `${billing.titleName} ${billing.firstName} ${billing.lastName}`;
          this.receiptInfo.buyerAddress = this.utils.getCurrentAddress({
            homeNo: billing.houseNumber || '',
            moo: billing.moo || '',
            mooBan: billing.mooban || '',
            room: billing.room,
            floor: billing.floor || '',
            buildingName: billing.buildingName || '',
            soi: billing.soi || '',
            street: billing.streetName || '',
            tumbol: billing.tumbol,
            amphur: billing.amphur || '',
            province: billing.provinceName || '',
            zipCode: billing.portalCode || '',
          });
          // tslint:disable-next-line:max-line-length
          if (this.transaction.data && this.transaction.data.billingInformation && this.transaction.data.billingInformation.billDeliveryAddress) {
            delete this.transaction.data.billingInformation.billDeliveryAddress;
          }
          this.mobileNo = mobileNo;
          this.transaction.data.action = TransactionAction.READ_CARD;

          this.modalRef.hide();
        }).catch((err: any) => {
          console.log('catch err', err);
          // this.mobileNo = mobileNo;
          this.router.navigate([ROUTE_DEVICE_AIS_DEVICE_EDIT_BILLING_ADDRESS_PAGE]);
          // this.pageLoadingService.closeLoading();
          // this.modalRef.hide();
        }).then(() => {
          this.pageLoadingService.closeLoading();
        });
      } else {
        console.log('ไม่มีเบอร์ AIS');
        this.transaction.data.customer = this.customerProfile;
        this.transaction.data.customer.zipCode = this.zipCode;
        this.receiptInfo.buyer = `${this.customerProfile.titleName} ${this.customerProfile.firstName} ${this.customerProfile.lastName}`;
        this.receiptInfo.buyerAddress = this.selectBillingAddrVal || '';
        // tslint:disable-next-line:max-line-length
        if (this.transaction.data && this.transaction.data.billingInformation && this.transaction.data.billingInformation.billDeliveryAddress) {
          delete this.transaction.data.billingInformation.billDeliveryAddress;
        }
        this.modalRef.hide();
      }
    } else {
      console.log('ELSE');
      console.log(this.selectBillingAddrVal);
    }

  }
  get onReadCardProgress(): boolean {
    return this.readCard ? this.readCard.progress > 0 && this.readCard.progress < 100 : false;
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
  editAddress(): void {
    this.router.navigate([ROUTE_DEVICE_AIS_DEVICE_EDIT_BILLING_ADDRESS_PAGE]);
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    this.transaction.data.payment = this.paymentDetailTemp.payment;
    this.transaction.data.advancePayment = this.paymentDetailTemp.advancePayment;
    this.receiptInfo.telNo = this.receiptInfoForm.value.telNo;
    this.transaction.data.receiptInfo = this.receiptInfo;
    console.log('receiptInfo', this.transaction.data.receiptInfo);
    this.transaction.data.simCard = {
      mobileNo: this.mobileNo
    };
    // this.returnStock().then(() => {
    //   this.http.post(
    //     '/api/salesportal/add-device-selling-cart',
    //     this.getRequestAddDeviceSellingCart()
    //   ).toPromise()
    //     .then((resp: any) => {
    //       this.transaction.data.order = { soId: resp.data.soId };
    //       return this.sharedTransactionService.createSharedTransaction(this.transaction, this.priceOption);
    //     }).then(() => this.router.navigate([ROUTE_DEVICE_AIS_DEVICE_SUMMARY_PAGE]))
    //     .then(() => this.pageLoadingService.closeLoading());
    // });
    this.router.navigate([ROUTE_DEVICE_AIS_DEVICE_SUMMARY_PAGE]);
  }
  getRequestAddDeviceSellingCart(): any {
    const productStock = this.priceOption.productStock;
    const productDetail = this.priceOption.productDetail;
    const customer = this.transaction.data.customer;
    return {
      soCompany: productStock.company || 'AWN',
      locationSource: this.user.locationCode,
      locationReceipt: this.user.locationCode,
      productType: productDetail.productType || 'DEVICE',
      productSubType: productDetail.productSubType || 'HANDSET',
      brand: productStock.brand,
      model: productDetail.model,
      color: productStock.color,
      priceIncAmt: '',
      priceDiscountAmt: '',
      grandTotalAmt: '',
      userId: this.user.username,
      cusNameOrder: `${customer.firstName || ''} ${customer.lastName || ''}`.trim(),
      preBookingNo: '',
      depositAmt: '',
      reserveNo: ''
    };
  }

  onBack(): void {
    this.router.navigate([ROUTE_BUY_PRODUCT_CAMPAIGN_PAGE]);
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
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy(): void {
    if (this.readCardSubscription) {
      this.readCardSubscription.unsubscribe();
    }
    this.priceOptionService.update(this.priceOption);
    this.transactionService.save(this.transaction);
  }
  createTransaction(): void {
    console.log('createTransaction');
    this.transaction = {
      data: {
        transactionType: TransactionType.DEVICE_ORDER_NEW_REGISTER_AIS,
        action: null,
      }
    };
  }

}
