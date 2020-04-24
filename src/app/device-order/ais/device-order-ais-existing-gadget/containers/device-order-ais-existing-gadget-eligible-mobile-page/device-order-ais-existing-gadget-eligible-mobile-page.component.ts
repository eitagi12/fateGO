import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { ShoppingCart, EligibleMobile, HomeService, PageLoadingService, AlertService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction, Customer } from 'src/app/shared/models/transaction.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PrivilegeService } from 'src/app/device-order/services/privilege.service';
import { TranslateService } from '@ngx-translate/core';
import { ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_CUSTOMER_INFO_PAGE, ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_MOBILE_DETAIL_PAGE, ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_CHANGE_PACKAGE_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-gadget/constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-existing-gadget-eligible-mobile-page',
  templateUrl: './device-order-ais-existing-gadget-eligible-mobile-page.component.html',
  styleUrls: ['./device-order-ais-existing-gadget-eligible-mobile-page.component.scss']
})
export class DeviceOrderAisExistingGadgetEligibleMobilePageComponent implements OnInit, OnDestroy {
  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;
  identityValid: boolean = false;

  shoppingCart: ShoppingCart;
  transaction: Transaction;

  eligibleMobileNo: Array<EligibleMobile>;
  eligibleMobileFbb: Array<EligibleMobile>;
  eligibleMobiles: Array<any>;
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
    private translateService: TranslateService,
    private priceOptionService: PriceOptionService,
    private alertService: AlertService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.homeService.callback = () => {
      this.alertService.question('ต้องการยกเลิกรายการขายหรือไม่ การยกเลิก ระบบจะคืนสินค้าเข้าสต๊อคสาขาทันที', 'ตกลง', 'ยกเลิก')
        .then((response: any) => {
          if (response.value === true) {
            this.returnStock().then(() => {
              this.transactionService.remove();
              window.location.href = '/';
            });
          }
        });
    };
  }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    const mobileNo = this.callQueryEligibleMobileListService();
    const mobileFbb = this.callQueryEligibleFbbListService();

    Promise.all([mobileNo, mobileFbb]).then((res: any[]) => {
      this.mobilesList();
    });
  }

  callQueryEligibleMobileListService(): Promise<any> {
    const idCardNo = this.transaction.data.customer.idCardNo;
    const ussdCode = this.priceOption.trade.ussdCode;
    return this.http.post('/api/customerportal/query-eligible-mobile-list', {
      idCardNo: idCardNo,
      ussdCode: ussdCode,
      mobileType: `Post-paid`,
      chkMainProFlg: true
    }).toPromise()
      .then((response: any) => {
        const eligibleMobile: EligibleMobile[] = [];
        response.data.postpaid.filter(res => {
          return res.privilegeMessage !== 'MT_INVALID_CRITERIA_MAINPRO';
        }).map(res => {
          eligibleMobile.push(res);
        });
        this.eligibleMobileNo = eligibleMobile || [];
        this.pageLoadingService.closeLoading();
      }).catch(() => {
        this.pageLoadingService.closeLoading();
        this.eligibleMobileNo = [];
      });
  }

  callQueryEligibleFbbListService(): Promise<any> {
    const idCardNo = this.transaction.data.customer.idCardNo;
    const ussdCode = this.priceOption.trade.ussdCode;
    return this.http.post('/api/customerportal/query-eligible-fbb-list', {
      idCardNo: idCardNo,
      ussdCode: ussdCode,
      chkMainProFlg: true
    }).toPromise()
      .then((response: any) => {
        const eligibleMobile: EligibleMobile[] = [];
        response.data.fbbLists.filter(res => {
          return res.privilegeMessage !== 'MT_INVALID_CRITERIA_MAINPRO';
        }).map(res => {
          eligibleMobile.push(res);
        });
        this.eligibleMobileFbb = eligibleMobile || [];
        this.pageLoadingService.closeLoading();
      }).catch(() => {
        this.pageLoadingService.closeLoading();
        this.eligibleMobileFbb = [];
      });
  }

  mobilesList(): void {
    this.eligibleMobiles = this.eligibleMobileNo.concat(this.eligibleMobileFbb);
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
    // <check isCritiriaMainPro> //
    // if (this.isCritiriaMainPro) {
    //   this.transaction.data.simCard = { mobileNo: this.onSelected.mobileNo };
    //   this.pageLoadingService.closeLoading();
    //   this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_CHANGE_PACKAGE_PAGE]);
    // } else {

    this.privilegeService.requestUsePrivilege(this.onSelected.mobileNo, this.priceOption.trade.ussdCode, this.onSelected.privilegeCode)
      .then((privilegeCode) => {
        this.transaction.data.customer.privilegeCode = privilegeCode;
        this.transaction.data.simCard = { mobileNo: this.onSelected.mobileNo };
      }).then((resp) => {
        this.pageLoadingService.closeLoading();
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_MOBILE_DETAIL_PAGE]);
      });
    // }
  }

  // <check isCritiriaMainPro> //
  // get isCritiriaMainPro(): boolean {
  //   return !this.advancePay && this.onSelected.privilegeMessage === `MT_INVALID_CRITERIA_MAINPRO`;
  // }

  get advancePay(): boolean {
    return !!(+(this.priceOption.trade.advancePay && +this.priceOption.trade.advancePay.amount || 0) > 0);
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_CUSTOMER_INFO_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  returnStock(): Promise<void> {
    return new Promise(resolve => {
      const transaction = this.transactionService.load();
      const promiseAll = [];
      if (transaction.data) {
        if (transaction.data.order && transaction.data.order.soId) {
          const order = this.http.post('/api/salesportal/device-sell/item/clear-temp-stock', {
            location: this.priceOption.productStock.location,
            soId: transaction.data.order.soId,
            transactionId: transaction.transactionId
          }).toPromise().catch(() => Promise.resolve());
          promiseAll.push(order);
        }
      }
      Promise.all(promiseAll).then(() => resolve());
    });
  }
}
