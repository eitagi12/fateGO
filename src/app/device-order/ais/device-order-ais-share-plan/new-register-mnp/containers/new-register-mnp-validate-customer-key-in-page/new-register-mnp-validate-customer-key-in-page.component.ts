import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Route, Router } from '@angular/router';
import { HomeService, CustomerService, AlertService, Utils } from 'mychannel-shared-libs';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { TranslateService } from '@ngx-translate/core';
import { ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_VALIDATE_CUSTOMER_PAGE, ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_PAYMENT_DETAIL_PAGE } from '../../constants/route-path.constant';
@Component({
  selector: 'app-new-register-mnp-validate-customer-key-in-page',
  templateUrl: './new-register-mnp-validate-customer-key-in-page.component.html',
  styleUrls: ['./new-register-mnp-validate-customer-key-in-page.component.scss']
})
export class NewRegisterMnpValidateCustomerKeyInPageComponent implements OnInit, OnDestroy {
  params: Params;
  prefixes: string[];
  cardTypes: string[];
  keyInValid: boolean;
  transaction: Transaction;
  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private homeService: HomeService,
    private customerService: CustomerService,
    private transactionService: TransactionService,
    private alertService: AlertService,
    private utils: Utils,
    private translateService: TranslateService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: Params) => this.params = params);
    this.callService();
  }

  callService(): void {
    this.customerService.queryCardType().then((res: any) => {
      this.cardTypes = (res.data.cardTypes || []).map((cardType: any) => cardType.name);
    });

    this.customerService.queryTitleName().then((res: any) => {
      this.prefixes = (res.data.titleNames || []).map((prefix: any) => prefix);
    });
  }

  onCompleted(value: any): void {
    this.mapCustomerInfo(value);
  }

  onError(valid: boolean): void {
    this.keyInValid = valid;
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): void {
    this.alertService.question(this.translateService.instant('ท่านต้องการยกเลิกการซื้อสินค้าหรือไม่'))
      .then((res: any) => {
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_VALIDATE_CUSTOMER_PAGE]);
      });
  }

  onNext(): void {
    if (this.checkBusinessLogic()) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_PAYMENT_DETAIL_PAGE]);
    }
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
    this.transactionService.update(this.transaction);
  }
}
