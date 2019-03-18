import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { PageLoadingService, AlertService, TokenService } from 'mychannel-shared-libs';
import { Seller, Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Router } from '@angular/router';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';

@Component({
  selector: 'app-deposit-payment-summary-page',
  templateUrl: './deposit-payment-summary-page.component.html',
  styleUrls: ['./deposit-payment-summary-page.component.scss']
})
export class DepositPaymentSummaryPageComponent implements OnInit {
  // @ViewChild(SellerInfoComponent) sellerInfo: SellerInfoComponent;

  // public processStep$: Observable<ProcessStep>;
  public backUrl: string;
  public channelType: string;
  public nextUrl: string = '/device-selling/queue';
  public seller$: Observable<Seller>;
  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;
  // public customer$: Observable<Customer>;
  // public billingInfotmation$: Observable<BillingInformation>;
  // public selectCustomerGroup$: Observable<PriceOptionPrivilegeCustomerGroup>;
  transaction: Transaction;

  constructor(
    private router: Router,
    private tokenService: TokenService,
    private alertService: AlertService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService
  ) {
    this.transaction = this.transactionService.load();
    this.channelType = tokenService.getUser().channelType;
    // this.processStep$ = store.select(fromDeviceOrder.getProcessStep);
    // this.seller$ = store.select(fromDeviceOrder.getSeller);
    // this.customer$ = store.select(fromDeviceOrder.getCustomer);
    // this.selectCustomerGroup$ = this.globalDeviceOrderService.getSelectPriceOptionPrivilegeCustomerGroup();
    // this.billingInfotmation$ = store.select(fromDeviceOrder.getBillingInformation);
  }

  ngOnInit(): void {
   this.tokenService.getUser();
    // this.store.dispatch(new sellerAction.UpdateSellerLocationCodeAction(this.tokenService.getLocationCode()));
    // this.store.dispatch(new sellerAction.UpdateSellerBranchAction(this.tokenService.getLocationCode()));
    // this.store.dispatch(new sellerAction.UpdateSharedUserLocation(this.tokenService.getSharedUser()));
    // if (this.isUserASPType()) {
    //   this.store.dispatch(new sellerAction.UpdateSellerNameAction(this.tokenService.getFullName()));
    // } else {
    //   this.store.dispatch(new sellerAction.UpdateSellerNameAction(this.tokenService.getUsername()));
    // }
    // this.updateSeller();
  }

  onCancel(): void {
    this.backUrl = '';
    this.router.navigate([this.backUrl]);
  }
  // onNext() {
  //   let seller: Seller = this.sellerInfo.getSeller();
  //   console.log("next!! seller")
  //   console.log(seller)
  //   this.onSelectSeller(seller);
  //   this.router.navigate([this.nextUrl]);
  // }

  isUserASPType(): boolean {
    return this.tokenService.getUser().userType === 'ASP';
  }

  // updateSeller() {
  //   this.
  //     this.store.dispatch(new sellerAction.LoadDefaultSellerInfoAction());
  //   if (this.seller$) {
  //     this.seller$.subscribe((seller: Seller) => {

  //       // เข้ามาครั้งแรก sellerNo == undefined
  //       if (typeof seller.sellerNo == 'undefined' && this.isUserASPType()) {
  //         this.store.dispatch(new sellerAction.UpdateSellerNoAction(this.tokenService.getASCCode()));
  //         return;
  //       }

  //       if (typeof seller.sellerNo == 'undefined') {
  //         if (this.isUserASPType()) {
  //           console.log("userType", this.isUserASPType);
  //           this.store.dispatch(new sellerAction.UpdateSellerNoAction(this.tokenService.getASCCode()));
  //         } else {
  //           this.store.dispatch(new sellerAction.UpdateSellerEmployeeNoAction(this.tokenService.getUsername()));
  //         }
  //       } else {
  //         this.store.dispatch(new sellerAction.UpdateSellerNoAction(seller.sellerNo));
  //       }
  //     }).unsubscribe();
  //   }
  // }

  // onSelectSeller(seller: Seller) {
  //   seller.sellerNo = seller.sellerNo || '';
  //   seller.isAscCode = false;
  //   this.store.dispatch(new sellerAction.UpdateSellerAction(seller));
  //   this.seller$.subscribe(seller => {
  //     if (this.isUserASPType() && !seller.sellerNo) {
  //       this.goToAgreementPage();
  //     } else {
  //       this.checkSeller(seller);
  //     }
  //   }).unsubscribe();
  // }

  // checkSeller(seller: Seller) {
  //   if (!seller.sellerNo) {
  //     this.alertService.setpopupMessage('กรุณาระบุรหัสพนักงานขาย');
  //     this.alertService.openPopup();
  //     return;
  //   }

  //   this.pageLoadingService.openLoading();
  //   this.sellerService.checkSeller(seller.sellerNo)
  //     .subscribe((shopCheckSeller: ShopCheckSeller) => {
  //       this.pageLoadingService.closeLoading();
  //       if (shopCheckSeller.condition) {
  //         seller.isAscCode = shopCheckSeller.isAscCode;
  //         this.store.dispatch(new sellerAction.UpdateSellerAction(seller));
  //         this.goToAgreementPage();
  //       } else {
  //         this.alertService.setpopupMessageHtml(shopCheckSeller.message);
  //         this.alertService.openPopup();
  //       }
  //     }, (error: any) => {
  //       this.pageLoadingService.closeLoading();

  //       this.alertService.setpopupMessage('ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้');
  //       this.alertService.openPopup();
  //     });
  // }

  // goToAgreementPage() {
  //   // this.locationHistoryService.addToHistory();
  //   // this.router.navigate(['/device-order/agreement']);
  //   const agreementPageURL = '/' + RoutePath.ROUTE_PREFIX + '/' + RoutePath.AGREEMENT_PAGE;
  //   this.router.navigate([agreementPageURL]);
  // }
}
