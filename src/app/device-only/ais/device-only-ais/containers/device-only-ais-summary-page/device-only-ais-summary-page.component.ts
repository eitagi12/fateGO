import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_DEVICE_ONLY_AIS_SELECT_MOBILE_CARE_PAGE, ROUTE_DEVICE_ONLY_AIS_CHECKOUT_PAYMENT_PAGE, ROUTE_DEVICE_ONLY_AIS_CHECKOUT_PAYMENT_QR_CODE_PAGE } from 'src/app/device-only/ais/device-only-ais/constants/route-path.constant';
import { HomeService, AlertService, TokenService, ShoppingCart, PageLoadingService } from 'mychannel-shared-libs';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Transaction, Seller } from 'src/app/shared/models/transaction.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { SummarySellerCodeComponent } from 'src/app/device-only/components/summary-seller-code/summary-seller-code.component';
import { WIZARD_DEVICE_ONLY_AIS } from 'src/app/device-only/constants/wizard.constant';
import { HomeButtonService } from 'src/app/device-only/services/home-button.service';
import { SellerService } from 'src/app/device-only/services/seller.service';
import { ShopCheckSeller } from 'src/app/device-only/models/shopCheckSeller.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-device-only-ais-summary-page',
  templateUrl: './device-only-ais-summary-page.component.html',
  styleUrls: ['./device-only-ais-summary-page.component.scss']
})
export class DeviceOnlyAisSummaryPageComponent implements OnInit, OnDestroy {

  @ViewChild(SummarySellerCodeComponent) summarySellerCode: SummarySellerCodeComponent;

  wizards: string[] = WIZARD_DEVICE_ONLY_AIS;
  shoppingCart: ShoppingCart;
  priceOption: PriceOption;
  transaction: Transaction;
  priceMobileCare: number;
  balance: number;
  enoughBalance: boolean;
  isShowBalance: boolean;
  isNext: boolean;
  isReasonNotBuyMobileCare: boolean;
  editName: any;
  sellerCode: string;
  seller: Seller;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private homeButtonService: HomeButtonService,
    private alertService: AlertService,
    private sellerService: SellerService,
    private tokenService: TokenService,
    private pageLoadingService: PageLoadingService,
    private http: HttpClient,
  ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.homeButtonService.initEventButtonHome();
    this.checkShowBalance();
    this.callServiceEmployee();
  }

  checkSeller(seller: Seller): void {
    const user = this.tokenService.getUser();
    if (!seller.sellerNo) {
      this.alertService.warning('กรุณากรอกข้อมูลให้ถูกต้อง');
      return;
    }
    this.pageLoadingService.openLoading();
    this.sellerService.checkSeller(seller.sellerNo).then((shopCheckSeller: ShopCheckSeller) => {
      this.pageLoadingService.closeLoading();
      if (shopCheckSeller.condition) {
        this.transaction.data.seller = {
          ...this.seller,
          sellerNo: this.sellerCode || '',
          employeeId: seller.sellerNo || '',
          locationCode: this.tokenService.getUser().locationCode
        };
        if (this.transaction.data.payment.paymentType === 'QR_CODE' ||
          this.transaction.data.payment.paymentOnlineCredit === true) {
            this.router.navigate([ROUTE_DEVICE_ONLY_AIS_CHECKOUT_PAYMENT_QR_CODE_PAGE]);
        } else {
          this.router.navigate([ROUTE_DEVICE_ONLY_AIS_CHECKOUT_PAYMENT_PAGE]);
        }
      } else {
        this.alertService.warning(shopCheckSeller.message);
      }
    })
      .catch(() => {
        this.pageLoadingService.closeLoading();
        this.alertService.warning('ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้');
      });
  }

  callServiceEmployee(): void {
    const user = this.tokenService.getUser();
    this.http.get(`/api/salesportal/location-by-code?code=${user.locationCode}`).toPromise().then((response: any) => {
      this.seller = {
        sellerName: user.firstname && user.lastname ? `${user.firstname} ${user.lastname}` : user.username,
        locationName: response.data.displayName,
        locationCode: user.locationCode
      };
      this.transaction.data.seller = this.seller;
      return this.http.get(`/api/customerportal/newRegister/getEmployeeDetail/username/${user.username}`).toPromise()
        .then((emResponse: any) => {
          if (emResponse && emResponse.data) {
            const emId = emResponse.data.pin;
            this.sellerCode = emId;
          }
        }).catch(() => {
          this.sellerCode = '';
        });
    });
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ONLY_AIS_SELECT_MOBILE_CARE_PAGE]);
  }

  onNext(): void {
    if (this.transaction.data.payment.paymentForm === 'FULL' &&
        this.transaction.data.payment.paymentOnlineCredit === true &&
        this.transaction.data.payment.paymentType === 'CREDIT' &&
        this.editName) {
      if (this.editName.firstName && this.editName.lastName) {
        this.transaction.data.shippingInfo.firstName = this.editName.firstName;
        this.transaction.data.shippingInfo.lastName = this.editName.lastName;
      } else {
        this.transaction.data.shippingInfo.firstName = this.transaction.data.customer.firstName;
        this.transaction.data.shippingInfo.lastName = this.transaction.data.customer.lastName;
      }
      const seller: Seller = this.summarySellerCode.getSeller();
      this.checkSeller(seller);
    } else {
      const seller: Seller = this.summarySellerCode.getSeller();
      this.checkSeller(seller);
    }
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onComplete(value: any): void {
    this.editName = value;
  }

  checkShowBalance(): void {
    if (this.transaction.data.mobileCarePackage.customAttributes && this.transaction.data.simCard.chargeType === 'Pre-paid') {
      this.getBalance();
    } else {
      this.isNext = true;
      this.isShowBalance = false;
    }
  }

  getBalance(): void {
    this.pageLoadingService.openLoading();
    const mobileNo = this.transaction.data.simCard.mobileNo;
    this.http.get(`/api/customerportal/newRegister/${mobileNo}/getBalance`).toPromise()
      .then((response: any) => {
        this.pageLoadingService.closeLoading();
        this.priceMobileCare = +this.transaction.data.mobileCarePackage.customAttributes.priceInclVat;
        this.balance = +(response.data.remainingBalance) / 100;
        this.enoughBalance = (this.balance >= this.priceMobileCare) ? true : false;
        this.isNext = this.enoughBalance;
        this.isShowBalance = true;
      });
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }
}
