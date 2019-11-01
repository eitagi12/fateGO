import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { ROUTE_NEW_SHARE_PLAN_MNP_CUSTOMER_INFO_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_ID_CARD_CAPTURE_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_VALIDATE_CUSTOMER_PAGE } from '../../constants/route-path.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { HomeService, CustomerService, AlertService, Utils } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-new-share-plan-mnp-validate-customer-key-in-page',
  templateUrl: './new-share-plan-mnp-validate-customer-key-in-page.component.html',
  styleUrls: ['./new-share-plan-mnp-validate-customer-key-in-page.component.scss']
})
export class NewSharePlanMnpValidateCustomerKeyInPageComponent implements OnInit, OnDestroy {

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
    private translation: TranslateService

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

  onBack(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_VALIDATE_CUSTOMER_PAGE]);
  }

  onNext(): void {
    if (this.checkBusinessLogic()) {
      this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_CUSTOMER_INFO_PAGE]);
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
      this.alertService.error(this.translation.instant('ไม่สามารถทำรายการได้ เนื่องจากอายุของผู้ใช้บริการต่ำกว่า 17 ปี'));
      return false;
    }
    if (this.utils.isIdCardExpiredDate(expireDate)) {
      this.alertService.error(this.translation.instant('ไม่สามารถทำรายการได้ เนื่องจาก' + idCardType + 'หมดอายุ')).then(() => {
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
