import { Component, OnInit, OnDestroy } from '@angular/core';
import { Params, Router, ActivatedRoute } from '@angular/router';
import { HomeService, CustomerService, AlertService, Utils, User, TokenService, PageLoadingService } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_VALIDATE_CUSTOMER_PAGE,
         ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_PAYMENT_DETAIL_PAGE } from '../../constants/route-path.constant';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { ValidateCustomerService } from 'src/app/shared/services/validate-customer.service';
import { Transaction, Order, TransactionType } from 'src/app/device-order/ais/device-order-ais-mnp/models/transaction.model';
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
  customerKeyinInfo: any;
  user: User;
  order: Order;
  imageReadSmartCard: any;
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
    this.imageReadSmartCard = this.transaction.data.customer;
  }

  callService(): void {
    this.order = this.transaction.data.order;
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
    this.customerKeyinInfo = value;
    this.transaction.data.customer = this.validateCustomerService.mapCustomer(this.customerKeyinInfo, this.imageReadSmartCard);
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

  validateCustomerKeyin(): void {
    this.pageLoadingService.openLoading();
    const customer = {
      firstName: this.transaction.data.customer.firstName,
      lastName: this.transaction.data.customer.lastName
    };

    const checkAgeAndExpire = this.validateCustomerService.checkAgeAndExpireCard(this.transaction);
    if (checkAgeAndExpire.true) {
      this.validateCustomerService.app3Step(this.identity, this.user.username)
        .then((chk3Step: any) => {
          if (chk3Step.data.lockFlg === 'N') {
            if (this.order) {
              this.pageLoadingService.closeLoading();
              this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_PAYMENT_DETAIL_PAGE]);
            } else {
              // tslint:disable-next-line: max-line-length
              const body: any = this.validateCustomerService.getRequestAddDeviceSellingCart(this.user, this.transaction, this.priceOption, { customer: customer });
              this.validateCustomerService.addDeviceSellingCart(body).then((order: any) => {
                if (order.data && order.data.soId) {
                  this.transaction.data = {
                    ...this.transaction.data,
                    order: { soId: order.data.soId },
                  };
                  const transactionObject: any = this.validateCustomerService.buildTransaction({
                    transaction: this.transaction,
                    transactionType: TransactionType.DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN
                  });
                  this.validateCustomerService.createTransaction(transactionObject).then((resp: any) => {
                    this.pageLoadingService.closeLoading();
                    if (resp.data.isSuccess) {
                      this.transactionService.update(transactionObject);
                      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_PAYMENT_DETAIL_PAGE]);
                    } else {
                      this.alertService.error('ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้');
                    }
                  }).catch((error: any) => {
                    this.pageLoadingService.closeLoading();
                    this.alertService.error(error);
                  });
                } else {
                  this.alertService.error('ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้');
                }
              }).catch((error: any) => {
                this.pageLoadingService.closeLoading();
                this.alertService.error(error);
              });
            }
          } else {
            this.pageLoadingService.closeLoading();
            this.alertService.error('ติดแอพ 3 ชั้น');
          }
        }).catch((error: any) => {
          this.pageLoadingService.closeLoading();
          this.alertService.error(error);
        });
    } else {
      this.pageLoadingService.closeLoading();
      this.alertService.error(checkAgeAndExpire.false);
    }
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}
