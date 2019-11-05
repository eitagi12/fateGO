import { Component, OnInit, OnDestroy } from '@angular/core';
import { Params, Router, ActivatedRoute } from '@angular/router';
import { HomeService, CustomerService, AlertService, Utils, User, TokenService, PageLoadingService } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_VALIDATE_CUSTOMER_PAGE, ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_PAYMENT_DETAIL_PAGE } from '../../constants/route-path.constant';
import { Transaction, Prebooking, Order, TransactionType, TransactionAction, Customer } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { ValidateCustomerService } from 'src/app/shared/services/validate-customer.service';
@Component({
  selector: 'app-new-register-mnp-validate-customer-key-in-page',
  templateUrl: './new-register-mnp-validate-customer-key-in-page.component.html',
  styleUrls: ['./new-register-mnp-validate-customer-key-in-page.component.scss']
})
export class NewRegisterMnpValidateCustomerKeyInPageComponent implements OnInit, OnDestroy {
  params: Params;
  transaction: Transaction;
  priceOption: PriceOption;
  prefixes: string[] = [];
  cardTypes: string[] = [];
  keyInValid: boolean;
  identity: string;
  user: User;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private customerService: CustomerService,
    private alertService: AlertService,
    private priceOptionService: PriceOptionService,
    private tokenService: TokenService,
    private pageLoadingService: PageLoadingService,
    private validateCustomerService: ValidateCustomerService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.user = this.tokenService.getUser();
  }

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
    this.transaction.data.customer = this.validateCustomerService.mapCustomer(value);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_VALIDATE_CUSTOMER_PAGE]);
  }

  onNext(): void {
    this.validateCustomerKeyin();
  }

  // tslint:disable-next-line: typedef
  validateCustomerKeyin(): any {
    this.pageLoadingService.openLoading();
    const customer = {
      firstName: this.transaction.data.customer.firstName,
      lastName: this.transaction.data.customer.lastName
    };
    // tslint:disable-next-line: max-line-length
    const body: any = this.validateCustomerService.getRequestAddDeviceSellingCart(this.user, this.transaction, this.priceOption, { customer: customer });
    return this.validateCustomerService.addDeviceSellingCart(body).then((order: any) => {
      if (order.data && order.data.soId) {
        this.transaction.data = {
          ...this.transaction.data,
          order: this.transaction.data.order || { soId: order.data.soId },
        };
      }
    }).then(() => {
      const checkAgeAndExpire = this.validateCustomerService.checkAgeAndExpireCard(this.transaction);
      if (checkAgeAndExpire.true) {
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_PAYMENT_DETAIL_PAGE]);
        this.pageLoadingService.closeLoading();
      } else {
        this.pageLoadingService.closeLoading();
        this.alertService.error(checkAgeAndExpire.false);
      }
    });
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}
