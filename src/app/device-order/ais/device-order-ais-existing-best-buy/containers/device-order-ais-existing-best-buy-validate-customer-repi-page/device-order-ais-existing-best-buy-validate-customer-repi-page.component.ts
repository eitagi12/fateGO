import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, PageLoadingService, ApiRequestService, Utils } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Transaction, BillDeliveryAddress, Customer, TransactionAction, TransactionType } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_DETAIL_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_VALIDATE_CUSTOMER_ID_CARD_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_PAYMENT_DETAIL_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CUSTOMER_INFO_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CUSTOMER_PROFILE_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/constants/route-path.constant';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-validate-customer-repi-page',
  templateUrl: './device-order-ais-existing-best-buy-validate-customer-repi-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-validate-customer-repi-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyValidateCustomerRepiPageComponent implements OnInit, OnDestroy {

  wizards = WIZARD_DEVICE_ORDER_AIS;
  readonly PLACEHOLDER = '(หมายเลขโทรศัพท์ / เลขบัตรประชาชน)';
  readonly PLACEHOLDER_HEADDER = 'กรอกเอกสารแสดงตน';

  transaction: Transaction;
  identityValid = false;
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
    private apiRequestService: ApiRequestService,
    private http: HttpClient,
    private utils: Utils,
    private priceOptionService: PriceOptionService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit() {
  }

  onError(valid: boolean) {
    this.identityValid = valid;
  }

  onCompleted(identity: string) {
    this.identity = identity;
  }

  onReadCard() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_VALIDATE_CUSTOMER_ID_CARD_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }

  onBack() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_DETAIL_PAGE]);
  }

  onNext() {
    this.pageLoadingService.openLoading();
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
        this.transaction.data.customer = customer;
        this.transaction.data.billingInformation = {};
        this.transaction.data.billingInformation.billDeliveryAddress = this.billDeliveryAddress;

      }).then(() => {
        const mobileNo = this.transaction.data.simCard.mobileNo;
        this.http.get(`/api/customerportal/newRegister/verifyPrepaidIdent?idCard=${this.identity}&mobileNo=${mobileNo}`)
          .toPromise()
          .then((respPrepaidIdent: any) => {
            if (respPrepaidIdent.data && respPrepaidIdent.data.success) {
              this.transaction.data.action = TransactionAction.KEY_IN;
              this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CUSTOMER_INFO_PAGE]);
            } else {
              this.transaction.data.action = TransactionAction.KEY_IN_REPI;
              this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CUSTOMER_PROFILE_PAGE]);
            }
          });
      })
      .catch((e) => {
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_PAYMENT_DETAIL_PAGE]);
      })
      .then(() => {
        this.pageLoadingService.closeLoading();
      });
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }
}
