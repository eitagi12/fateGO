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
  mobileNo: any;
  priceOption: PriceOption;

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
          });
      });
    });
  }

  onCompleted(mobileNo: any): void {
    if (mobileNo) {
      this.identityValid = true;
      this.mobileNo = mobileNo;
    }
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    const trade = this.priceOption.trade;
    this.requestUsePrivilege(trade.ussdCode);
  }

  private requestUsePrivilege(ussdCode: any): void {
    this.privilegeService.requestUsePrivilege(this.mobileNo.mobileNo, ussdCode, this.mobileNo.privilegeCode).then((privilegeCode) => {
      this.transaction.data.customer.privilegeCode = privilegeCode;
      this.transaction.data.simCard = { mobileNo: this.mobileNo.mobileNo };
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
}
