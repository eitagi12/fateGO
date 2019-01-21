import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import {
  ROUTE_ORDER_MNP_SELECT_REASON_PAGE,
  ROUTE_ORDER_MNP_CUSTOMER_INFO_PAGE
} from 'src/app/order/order-mnp/constants/route-path.constant';
import { HomeService, CustomerService, AlertService, Utils } from 'mychannel-shared-libs';
import { Transaction, TransactionAction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';

@Component({
  selector: 'app-order-mnp-validate-customer-key-in-page',
  templateUrl: './order-mnp-validate-customer-key-in-page.component.html',
  styleUrls: ['./order-mnp-validate-customer-key-in-page.component.scss']
})
export class OrderMnpValidateCustomerKeyInPageComponent implements OnInit, OnDestroy {

  transaction: Transaction;
  params: Params;
  prefixes: string[] = [];
  cardTypes: string[] = [];
  keyInValid: boolean;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private customerService: CustomerService,
    private alertService: AlertService,
    private utils: Utils,
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => this.params = params);
    this.callService();
  }

  onError(valid: boolean) {
    this.keyInValid = valid;
  }

  onCompleted(value: any) {
    this.mapCustomerInfo(value);
  }

  onHome() {
    this.homeService.goToHome();
  }
  onBack() {
    this.router.navigate([ROUTE_ORDER_MNP_SELECT_REASON_PAGE]);
  }

  onNext() {
    if (this.checkBusinessLogic()) {
      this.router.navigate([ROUTE_ORDER_MNP_CUSTOMER_INFO_PAGE]);
    }
  }

  callService() {
    this.customerService.queryCardType().then((resp: any) => {
      this.cardTypes = (resp.data.cardTypes || []).map((cardType: any) => cardType.name);
    });

    this.customerService.queryTitleName().then((resp: any) => {
      this.prefixes = (resp.data.titleNames || []).map((prefix: any) => prefix);
    });
  }

  mapCustomerInfo(customer: any) {

    const birthdate = customer.birthDay + '/' + customer.birthMonth + '/' + customer.birthYear;
    const expireDate = customer.expireDay + '/' + customer.expireMonth + '/' + customer.expireYear;

    this.transaction.data.customer = {
      idCardNo: customer.idCardNo,
      titleName: customer.prefix,
      firstName: customer.firstName,
      lastName: customer.lastName,
      idCardType: customer.idCardType,
      gender: customer.gender,
      birthdate: birthdate,
      expireDate: expireDate
    };
    this.transaction.data.billingInformation = {};
  }

  checkBusinessLogic(): boolean {

    const birthdate = this.transaction.data.customer.birthdate;
    const expireDate = this.transaction.data.customer.expireDate;
    const idCardType = this.transaction.data.customer.idCardType;

    if (this.utils.isLowerAge17Year(birthdate)) {
      this.alertService.error('ไม่สามารถทำรายการได้ เนื่องจากอายุของผู้ใช้บริการต่ำกว่า 17 ปี');
      return false;
    }
    if (this.utils.isIdCardExpiredDate(expireDate)) {
      this.alertService.error('ไม่สามารถทำรายการได้ เนื่องจาก' + idCardType + 'หมดอายุ').then(() => {
        this.onBack();
      });
      return false;
    }
    return true;
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}
