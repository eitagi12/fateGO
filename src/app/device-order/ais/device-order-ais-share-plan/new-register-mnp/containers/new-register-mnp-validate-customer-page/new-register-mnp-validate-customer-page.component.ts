import { Component, OnInit, OnDestroy } from '@angular/core';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Transaction, TransactionType, TransactionAction } from 'src/app/shared/models/transaction.model';
import { Router } from '@angular/router';
import { HomeService, PageLoadingService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { ROUTE_BUY_PRODUCT_CAMPAIGN_PAGE } from 'src/app/buy-product/constants/route-path.constant';
import { ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_PAYMENT_DETAIL_PAGE, ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_VALIDATE_CUSTOMER_KEY_IN_PAGE, ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_VALIDATE_CUSTOMER_ID_CARD_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-new-register-mnp-validate-customer-page',
  templateUrl: './new-register-mnp-validate-customer-page.component.html',
  styleUrls: ['./new-register-mnp-validate-customer-page.component.scss']
})
export class NewRegisterMnpValidateCustomerPageComponent implements OnInit, OnDestroy {

  priceOption: PriceOption;
  transaction: Transaction;
  identityValid: boolean = false;
  identity: string;
  constructor(private router: Router,
    private homeService: HomeService,
    private http: HttpClient,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService) {
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
    this.createTransaction();
  }

  private createTransaction(): void {
    this.transaction = {
      data: {
        transactionType: TransactionType.DEVICE_ORDER_NEW_REGISTER_AIS,
        action: TransactionAction.KEY_IN,
      }
    };
    delete this.transaction.data.customer;
  }

  onError(valid: boolean): void {
    this.identityValid = valid;
  }

  onCompleted(identity: string): void {
    this.identity = identity;
  }

  onReadCard(): void {// ไปที่ห้า Read Card
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_VALIDATE_CUSTOMER_ID_CARD_PAGE]);
  }

  onBack(): void {
    this.router.navigate([ROUTE_BUY_PRODUCT_CAMPAIGN_PAGE], { queryParams: this.priceOption.queryParams });
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    this.http.get(`/api/customerportal/newRegister/${this.identity}/queryCustomerInfo`).toPromise()
      .then((resp: any) => {
        this.mapCustomer(resp.data);
        return this.http.get(`/api/customerportal/newRegister/${this.identity}/blackListLimit`).toPromise();
      }).then((resp: any) => { // ไปที่หน้า Payment Detail
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_PAYMENT_DETAIL_PAGE]);
      }).catch((resp: any) => { // ไปที่หน้า key in
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_VALIDATE_CUSTOMER_KEY_IN_PAGE], {
          queryParams: { idCardNo: this.identity }
        });
      }).then(() => {
        this.pageLoadingService.closeLoading();
      });
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }

  private mapCustomer(customer: any): void {
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
