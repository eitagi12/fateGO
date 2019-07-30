import { Component, OnInit } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { ShoppingCart, EligibleMobile, HomeService, PageLoadingService, AlertService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction, Customer } from 'src/app/shared/models/transaction.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ROUTE_DEVICE_ORDER_AIS_GADGET_MOBILE_DETAIL_PAGE, ROUTE_DEVICE_ORDER_AIS_GADGET_CUSTOMER_INFO_PAGE } from '../../constants/route-path.constant';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PrivilegeService } from 'src/app/device-order/services/privilege.service';
import { CustomerInfoService } from 'src/app/device-order/services/customer-info.service';

@Component({
  selector: 'app-device-order-ais-existing-gadget-eligible-mobile-page',
  templateUrl: './device-order-ais-existing-gadget-eligible-mobile-page.component.html',
  styleUrls: ['./device-order-ais-existing-gadget-eligible-mobile-page.component.scss']
})
export class DeviceOrderAisExistingGadgetEligibleMobilePageComponent implements OnInit {
  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;
  identityValid: boolean = false;

  shoppingCart: ShoppingCart;
  transaction: Transaction;
  eligibleMobiles: Array<EligibleMobile> = [];
  onSelected: any;
  priceOption: PriceOption;
  ussdCode: string;
  disableNextButton: boolean;

  constructor(
    private router: Router,
    private http: HttpClient,
    private homeService: HomeService,
    private shoppingCartService: ShoppingCartService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private privilegeService: PrivilegeService,
    private customerInfoService: CustomerInfoService,
    private priceOptionService: PriceOptionService,
    private alertService: AlertService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    this.queryFbbListService();
  }

  queryFbbListService(): void {
    const request = {
      option: '1',
      idCardNo: this.transaction.data.customer.idCardNo,
      idCardType: 'บัตรประชาชน'
    };
    this.customerInfoService.queryFbbInfo(request).then((resp) => {
      this.pageLoadingService.openLoading();
      resp.mobileLists.filter((mobileList: any) => {
        return mobileList.status === 'Active';
      }).map((ActiveMobile: any) => {
        this.privilegeService
          .checkPrivilegeByNumber(ActiveMobile.mobileNo, this.priceOption.trade.ussdCode, false)
          .then((privilegeCode: string) => {
            const setEligibleMobiles: any = {
              mobileNo: ActiveMobile.mobileNo,
              mobileStatus: 'Active',
              privilegeCode: privilegeCode
            } || [];
            this.eligibleMobiles.push(setEligibleMobiles);
            this.pageLoadingService.closeLoading();
          })
          .catch(this.ErrorMessage());
      });
    });
  }

  onCompleted(onSelected: any): void {
    if (onSelected) {
      this.identityValid = true;
      this.onSelected = onSelected;
    }
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    this.requestUsePrivilege();
  }

  private requestUsePrivilege(): void {
    this.privilegeService.requestUsePrivilege(this.onSelected.mobileNo, this.priceOption.trade.ussdCode, this.onSelected.privilegeCode)
      .then((privilegeCode) => {
        this.transaction.data.customer.privilegeCode = privilegeCode;
        this.transaction.data.simCard = { mobileNo: this.onSelected.mobileNo };
        if (this.transaction.data.customer && this.transaction.data.customer.firstName) {
          this.customerInfoService.getCustomerProfileByMobileNo(
            this.transaction.data.simCard.mobileNo,
            this.transaction.data.customer.idCardNo)
            .then((customer: Customer) => {
              this.transaction.data.customer = { ...this.transaction.data.customer, ...customer };
            });
        }
      }).then(() => {
        this.pageLoadingService.closeLoading();
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_GADGET_MOBILE_DETAIL_PAGE]);
      });
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_GADGET_CUSTOMER_INFO_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ErrorMessage(): (reason: any) => void | PromiseLike<void> {
    return (err: any) => {
      this.handleErrorMessage(err);
    };
  }

  handleErrorMessage(err: any): void {
    this.disableNextButton = true;
    this.pageLoadingService.closeLoading();
    const error = err.error || {};
    const developerMessage = (error.errors || {}).developerMessage;
    this.alertService.error((developerMessage && error.resultDescription)
      ? `${developerMessage} ${error.resultDescription}` : `ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้`);
  }
}
