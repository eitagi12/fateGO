import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, PageLoadingService, ApiRequestService, Utils, AlertService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Transaction, BillDeliveryAddress, Customer, TransactionAction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_DETAIL_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_PAYMENT_DETAIL_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CUSTOMER_INFO_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CUSTOMER_PROFILE_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_VALIDATE_CUSTOMER_ID_CARD_RPI_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/constants/route-path.constant';
import { CreateDeviceOrderBestBuyService } from '../../service/create-device-order-best-buy.service';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-validate-customer-repi-page',
  templateUrl: './device-order-ais-existing-best-buy-validate-customer-repi-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-validate-customer-repi-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyValidateCustomerRepiPageComponent implements OnInit, OnDestroy {

  wizards: any = WIZARD_DEVICE_ORDER_AIS;
  readonly PLACEHOLDER: string = '(เลขบัตรประชาชน)';
  readonly PLACEHOLDER_HEADDER: string = 'กรอกเอกสารแสดงตน';

  transaction: Transaction;
  identityValid: boolean = false;
  identity: string;
  band: string;
  model: string;
  priceOption: PriceOption;
  billDeliveryAddress: BillDeliveryAddress;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private http: HttpClient,
    private utils: Utils,
    private alertService: AlertService,
    private createDeviceOrderBestBuyService: CreateDeviceOrderBestBuyService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
  }

  onError(valid: boolean): void {
    this.identityValid = valid;
  }

  onCompleted(identity: string): void {
    this.identity = identity;
  }

  onReadCard(): void {
    this.transaction.data.action = TransactionAction.READ_CARD_REPI;
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_VALIDATE_CUSTOMER_ID_CARD_RPI_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_DETAIL_PAGE]);
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    const mobileNo = this.transaction.data.simCard.mobileNo;
    this.transaction.data.action = TransactionAction.KEY_IN_REPI;
    this.http.get(`/api/customerportal/newRegister/verifyPrepaidIdent?idCard=${this.identity}&mobileNo=${mobileNo}`)
      .toPromise()
      .then((respPrepaidIdent: any) => {
        if (respPrepaidIdent.data && respPrepaidIdent.data.success) {
          this.http.get(`/api/customerportal/newRegister/${this.identity}/queryCustomerInfo`)
            .toPromise()
            .then((resp: any) => {
              const data = resp.data || {};
              const fullName = (data.name || ' ').split(' ');
              const address = data.address || {};
              const customer: Customer = {
                idCardNo: this.identity || '',
                idCardType: data.idCardType || '',
                titleName: data.accntTitle || '',
                firstName: fullName[0] || '',
                lastName: fullName[1] || '',
                birthdate: data.birthdate || '',
                homeNo: address.houseNo || '',
                moo: address.moo || '',
                mooBan: address.mooban || '',
                buildingName: address.buildingName || '',
                floor: address.floor || '',
                room: address.room || '',
                street: address.streetName || '',
                soi: address.soi || '',
                tumbol: address.tumbol || '',
                amphur: address.amphur || '',
                province: address.provinceName || '',
                zipCode: address.zipCode || '',
                mainMobile: data.mainMobile || '',
                mainPhone: data.mainPhone || '',
                billCycle: data.billCycle || '',
                caNumber: data.accntNo || '',
                gender: data.gender || '',
                expireDate: ''
              };
              return Promise.resolve(customer);
            })
            .then((customer) => {
              this.billDeliveryAddress = {
                homeNo: customer.homeNo || '',
                moo: customer.moo || '',
                mooBan: customer.mooBan || '',
                room: customer.room || '',
                floor: customer.floor || '',
                buildingName: customer.buildingName || '',
                soi: customer.soi || '',
                street: customer.street || '',
                province: customer.province || '',
                amphur: customer.amphur || '',
                tumbol: customer.tumbol || '',
                zipCode: customer.zipCode || '',
              };
              this.transaction.data.customer = { ...this.transaction.data.customer, ...customer };
              this.transaction.data.billingInformation = {};
              this.transaction.data.billingInformation.billDeliveryAddress = this.billDeliveryAddress;
              this.createDeviceOrderBestBuyService.createAddToCartTrasaction(this.transaction, this.priceOption).then((transaction) => {
                this.transaction = transaction;
                this.pageLoadingService.closeLoading();
                this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CUSTOMER_INFO_PAGE]);
              });
            })
            .catch((e) => {
              if (!/Data Not Found./.test(e.error.resultDescription)) {
                this.alertService.error(e.error.resultDescription);
                return;
              }
              this.http.get(`/api/customerportal/customerprofile/${mobileNo}`).toPromise()
              .then((customer: any) => {
                const profile = customer.data;
                const names = profile.name.split(' ');
                this.transaction.data.customer = {
                  idCardNo: this.identity || '',
                  idCardType: 'ID_CARD',
                  titleName: profile.title,
                  firstName: names[0],
                  lastName: names[1],
                  birthdate: profile.birthdate,
                  gender: '',
                  caNumber: null
                };
                this.createDeviceOrderBestBuyService.createAddToCartTrasaction(this.transaction, this.priceOption).then((transaction) => {
                  this.transaction = transaction;
                  this.pageLoadingService.closeLoading();
                  this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_PAYMENT_DETAIL_PAGE]);
                });
              });
            })
            .then(() => {
              this.pageLoadingService.closeLoading();
            });
        } else {
          // REPI
          this.pageLoadingService.closeLoading();
          const simCard = this.transaction.data.simCard;
          if (simCard.chargeType === 'Pre-paid') {
            this.http.get(`/api/customerportal/newRegister/${this.identity}/queryCustomerInfo`)
            .toPromise()
            .then((resp: any) => {
              const data = resp.data || {};
              const fullName = (data.name || ' ').split(' ');
              const address = data.address || {};
              const customer: Customer = {
                idCardNo: this.identity || '',
                idCardType: data.idCardType || '',
                titleName: data.accntTitle || '',
                firstName: fullName[0] || '',
                lastName: fullName[1] || '',
                birthdate: data.birthdate || '',
                homeNo: address.houseNo || '',
                moo: address.moo || '',
                mooBan: address.mooban || '',
                buildingName: address.buildingName || '',
                floor: address.floor || '',
                room: address.room || '',
                street: address.streetName || '',
                soi: address.soi || '',
                tumbol: address.tumbol || '',
                amphur: address.amphur || '',
                province: address.provinceName || '',
                zipCode: address.zipCode || '',
                mainMobile: data.mainMobile || '',
                mainPhone: data.mainPhone || '',
                billCycle: data.billCycle || '',
                caNumber: data.accntNo || '',
                gender: data.gender || '',
                expireDate: ''
              };
              return Promise.resolve(customer);
            })
            .then((customer) => {
              this.billDeliveryAddress = {
                homeNo: customer.homeNo || '',
                moo: customer.moo || '',
                mooBan: customer.mooBan || '',
                room: customer.room || '',
                floor: customer.floor || '',
                buildingName: customer.buildingName || '',
                soi: customer.soi || '',
                street: customer.street || '',
                province: customer.province || '',
                amphur: customer.amphur || '',
                tumbol: customer.tumbol || '',
                zipCode: customer.zipCode || '',
              };
              this.transaction.data.customer = { ...this.transaction.data.customer, ...customer };
              this.transaction.data.billingInformation = {};
              this.transaction.data.billingInformation.billDeliveryAddress = this.billDeliveryAddress;
              this.createDeviceOrderBestBuyService.createAddToCartTrasaction(this.transaction, this.priceOption).then((transaction) => {
                this.transaction = transaction;
                this.pageLoadingService.closeLoading();
                this.transaction.data.action = TransactionAction.KEY_IN_REPI;
                this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CUSTOMER_PROFILE_PAGE]);
              });
            })
            .catch((e) => {
              if (!/Data Not Found./.test(e.error.resultDescription)) {
                this.alertService.error(e.error.resultDescription);
                return;
              }
              this.http.get(`/api/customerportal/customerprofile/${mobileNo}`).toPromise()
              .then((customer: any) => {
                const profile = customer.data;
                const names = profile.name.split(' ');
                this.transaction.data.customer = {
                  idCardNo: this.identity || '',
                  idCardType: 'ID_CARD',
                  titleName: profile.title,
                  firstName: names[0],
                  lastName: names[1],
                  birthdate: profile.birthdate,
                  gender: '',
                  caNumber: null
                };
                this.createDeviceOrderBestBuyService.createAddToCartTrasaction(this.transaction, this.priceOption).then((transaction) => {
                  this.transaction = transaction;
                  this.pageLoadingService.closeLoading();
                  this.transaction.data.action = TransactionAction.KEY_IN_REPI;
                  this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CUSTOMER_PROFILE_PAGE]);
                });
              });
            });
          } else {
            this.alertService.error('ไม่สามารถทำรายการได้ เบอร์รายเดือน ข้อมูลการแสดงตนไม่ถูกต้อง');
          }
        }
      });

  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }
}
