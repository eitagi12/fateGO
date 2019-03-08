import { Component, OnInit, OnDestroy } from '@angular/core';
import { Params, Router, ActivatedRoute } from '@angular/router';
import { HomeService, CustomerService, AlertService, Utils } from 'mychannel-shared-libs';
import { Transaction, TransactionAction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import {
  ROUTE_ORDER_NEW_REGISTER_ID_CARD_CAPTURE_PAGE,
  ROUTE_ORDER_NEW_REGISTER_VALIDATE_CUSTOMER_ID_CARD_PAGE
} from 'src/app/order/order-new-register/constants/route-path.constant';

@Component({
  selector: 'app-order-new-register-validate-customer-key-in-page',
  templateUrl: './order-new-register-validate-customer-key-in-page.component.html',
  styleUrls: ['./order-new-register-validate-customer-key-in-page.component.scss']
})
export class OrderNewRegisterValidateCustomerKeyInPageComponent implements OnInit, OnDestroy {

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

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: Params) => this.params = params);
    this.callService();
  }

  onError(valid: boolean): void {
    this.keyInValid = valid;
  }

  onCompleted(value: any): void {
    this.mapCustomerInfo(value);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): void {
    this.router.navigate([ROUTE_ORDER_NEW_REGISTER_VALIDATE_CUSTOMER_ID_CARD_PAGE]);
  }

  onNext(): void {
    if (this.checkBusinessLogic()) {
      this.router.navigate([ROUTE_ORDER_NEW_REGISTER_ID_CARD_CAPTURE_PAGE]);
    }
  }

  callService(): void {
    this.customerService.queryCardType().then((resp: any) => {
      this.cardTypes = (resp.data.cardTypes || []).map((cardType: any) => cardType.name);
    });

    this.customerService.queryTitleName().then((resp: any) => {
      this.prefixes = (resp.data.titleNames || []).map((prefix: any) => prefix);
    });
  }

  mapCustomerInfo(customer: any): void {

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
    this.transactionService.save(this.transaction);
  }
}
