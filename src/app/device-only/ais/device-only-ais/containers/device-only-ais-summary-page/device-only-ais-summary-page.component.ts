import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_DEVICE_ONLY_AIS_SELECT_MOBILE_CARE_PAGE, ROUTE_DEVICE_ONLY_AIS_CHECKOUT_PAYMENT_PAGE, ROUTE_DEVICE_ONLY_AIS_CHECKOUT_PAYMENT_QR_CODE_PAGE } from 'src/app/device-only/ais/device-only-ais/constants/route-path.constant';
import { HomeService, AlertService, TokenService, ShoppingCart, PageLoadingService, User } from 'mychannel-shared-libs';
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
  user: User;

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
    this.user = this.tokenService.getUser();
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
    this.pageLoadingService.openLoading();
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
          this.pageLoadingService.closeLoading();
          if (emResponse && emResponse.data) {
            const emId = emResponse.data.pin;
            this.sellerCode = emId;
          }
        }).catch(() => {
          this.sellerCode = '';
          this.pageLoadingService.closeLoading();
        });
    });
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ONLY_AIS_SELECT_MOBILE_CARE_PAGE]);
  }

  checkEditing(): boolean {
    if (this.editName === false) {
      return true;
    } else {
      return false;
    }
  }

  onNext(): void {
    const shippingInfo = this.transaction.data.shippingInfo;
    const customer = this.transaction.data.customer;
    if (this.user.locationCode === '63259') {
          if (shippingInfo) {
            this.mapShippingInfo(shippingInfo);
          } else {
            this.mapShippingInfo(customer);
          }
          const seller: Seller = this.summarySellerCode.getSeller();
          this.checkSeller(seller);

    } else {
      const seller: Seller = this.summarySellerCode.getSeller();
      this.checkSeller(seller);
    }
  }

  mapShippingInfo(customer: any): void {
    const editName = this.editName ? this.editName : '';
    const firstName = editName ? editName.firstName ? editName.firstName : customer.firstName : customer.firstName;
    const lastName = editName ? editName.lastName ? editName.lastName : customer.lastName : customer.lastName;
    this.transaction.data = {
      ...this.transaction.data,
      shippingInfo: {
        titleName: 'คุณ',
        firstName: firstName,
        lastName: lastName,
        homeNo: customer.homeNo || '',
        moo: customer.moo || '',
        mooBan: customer.mooBan || '',
        buildingName: customer.buildingName || '',
        floor: customer.floor || '',
        room: customer.room || '',
        street: customer.street || '',
        soi: customer.soi || '',
        tumbol: customer.tumbol || '',
        amphur: customer.amphur,
        province: customer.province || customer.provinceName || '',
        zipCode: customer.zipCode || '',
        telNo: this.transaction.data.receiptInfo.telNo
      }
    };
    this.transactionService.update(this.transaction);
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
    const shippingInfo = this.transaction.data.shippingInfo;
    const editName = this.editName || '';
    if (editName) {
      const firstName = editName.firstName;
      const lastName = editName.lastName;
      if (shippingInfo) {
        this.transaction.data.shippingInfo.firstName = firstName ? firstName : shippingInfo.firstName;
        this.transaction.data.shippingInfo.lastName = lastName ? lastName : shippingInfo.lastName;
      } else {
        this.mapShippingInfo(this.transaction.data.customer);
      }
    }
    this.transactionService.save(this.transaction);
  }
}
