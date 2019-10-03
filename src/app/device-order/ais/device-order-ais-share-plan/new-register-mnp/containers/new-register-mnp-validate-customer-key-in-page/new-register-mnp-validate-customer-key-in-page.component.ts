import { Component, OnInit } from '@angular/core';
import { Params, Router, ActivatedRoute } from '@angular/router';
import { HomeService, CustomerService, AlertService, Utils } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_VALIDATE_CUSTOMER_PAGE } from '../../constants/route-path.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';

@Component({
  selector: 'app-new-register-mnp-validate-customer-key-in-page',
  templateUrl: './new-register-mnp-validate-customer-key-in-page.component.html',
  styleUrls: ['./new-register-mnp-validate-customer-key-in-page.component.scss']
})
export class NewRegisterMnpValidateCustomerKeyInPageComponent implements OnInit {
  params: Params;
  transaction: Transaction;
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
    private utils: Utils
  ) { }

  ngOnInit(): void {
    this.callService();
    this.activatedRoute.queryParams.subscribe((params: Params) => this.params = params);
  }

  callService(): void {
    this.customerService.queryCardType().then((resp: any) => {
      this.cardTypes = (resp.data.cardTypes || []).map((cardType: any) => cardType.name);
    });

    this.customerService.queryTitleName().then((resp: any) => {
      this.prefixes = (resp.data.titleNames || []).map((prefix: any) => prefix);
    });
  }

  onError(valid: boolean): void {
    this.keyInValid = valid;
  }

  onCompleted(value: any): void {
    console.log(value);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_VALIDATE_CUSTOMER_PAGE]);
  }

  onNext(): void {
    this.router.navigate(['รอแก้ไข']);
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
}
