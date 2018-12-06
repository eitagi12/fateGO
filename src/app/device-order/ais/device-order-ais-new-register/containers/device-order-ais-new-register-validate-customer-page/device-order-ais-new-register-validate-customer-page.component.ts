import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HomeService, PageLoadingService } from 'mychannel-shared-libs';
import { ROUTE_BUY_PRODUCT_CAMPAIGN_PAGE } from 'src/app/buy-product/constants/route-path.constant';
import {
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_VALIDATE_CUSTOMER_ID_CARD_PAGE,
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_VALIDATE_CUSTOMER_KEY_IN_PAGE,
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_PAYMENT_DETAIL_PAGE
} from 'src/app/device-order/ais/device-order-ais-new-register/constants/route-path.constant';
import { Transaction, TransactionType, TransactionAction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';


@Component({
  selector: 'app-device-order-ais-new-register-validate-customer-page',
  templateUrl: './device-order-ais-new-register-validate-customer-page.component.html',
  styleUrls: ['./device-order-ais-new-register-validate-customer-page.component.scss']
})
export class DeviceOrderAisNewRegisterValidateCustomerPageComponent implements OnInit, OnDestroy {

  priceOption: PriceOption;

  transaction: Transaction;

  identityValid = false;
  identity: string;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private http: HttpClient,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService
  ) {
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit() {
    this.createTransaction();
  }

  onError(valid: boolean) {
    this.identityValid = valid;
  }

  onCompleted(identity: string) {
    this.identity = identity;
  }

  onReadCard() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_VALIDATE_CUSTOMER_ID_CARD_PAGE]);
  }

  onBack() {
    this.router.navigate([ROUTE_BUY_PRODUCT_CAMPAIGN_PAGE], { queryParams: this.priceOption.queryParams });
  }

  onNext() {
    this.pageLoadingService.openLoading();
    this.http.get(`/api/customerportal/newRegister/${this.identity}/queryCustomerInfo`)
      .toPromise()
      .then((resp: any) => {
        this.mapCustomer(resp.data);
        return this.http.get(`/api/customerportal/newRegister/${this.identity}/blackListLimit`).toPromise();
      })
      .then((resp: any) => {
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_PAYMENT_DETAIL_PAGE]);
      })
      .catch((resp: any) => {
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_VALIDATE_CUSTOMER_KEY_IN_PAGE], {
          queryParams: {
            idCardNo: this.identity
          }
        });
      })
      .then(() => {
        this.pageLoadingService.closeLoading();
      });
  }

  onHome() {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }

  private createTransaction() {
    // this.transaction = {
    //   data: {
    //     transactionType: TransactionType.DEVICE_ORDER_NEW_REGISTER_AIS,
    //     action: TransactionAction.KEY_IN,
    //   }
    // };
    // delete this.transaction.data.customer;
  }

  private mapCustomer(customer: any) {
    const fullName = (customer.name || ' ').split(' ');
    const address = customer.address || {};

    this.transaction.data.customer = {
      idCardNo: this.identity,
      idCardType: customer.idCardType,
      titleName: customer.accntTitle,
      firstName: fullName[0],
      lastName: fullName[1],
      birthdate: customer.birthdate,
      gender: customer.gender,
      homeNo: address.homeNo,
      moo: address.moo,
      mooBan: address.mooban,
      buildingName: address.buildingName,
      floor: address.floor,
      room: address.room,
      street: address.street,
      soi: address.soi,
      tumbol: address.tumbol,
      amphur: address.amphur,
      province: address.province,
      firstNameEn: '',
      lastNameEn: '',
      issueDate: customer.birthdate,
      expireDate: null,
      zipCode: address.zipCode,
      mainMobile: customer.mainMobile,
      mainPhone: customer.mainPhone,
      billCycle: customer.billCycle,
      caNumber: customer.accntNo,
      imageSignature: '',
      imageSmartCard: '',
      imageReadSmartCard: '',
    };
  }
}
