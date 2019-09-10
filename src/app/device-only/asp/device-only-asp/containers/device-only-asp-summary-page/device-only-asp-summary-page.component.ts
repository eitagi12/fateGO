import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Seller, Transaction, Customer } from 'src/app/shared/models/transaction.model';
import { SummarySellerCodeComponent } from 'src/app/device-only/components/summary-seller-code/summary-seller-code.component';
import { AlertService, TokenService, User, HomeService, PageLoadingService } from 'mychannel-shared-libs';
import { SellerService } from 'src/app/device-only/services/seller.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Router } from '@angular/router';
import { ROUTE_DEVICE_ONLY_ASP_SELECT_MOBILE_CARE_PAGE, ROUTE_DEVICE_ONLY_ASP_READ_CARD_PAGE } from '../../constants/route-path.constant';
import { ShopCheckSeller } from 'src/app/device-only/models/shopCheckSeller.model';
import { HomeButtonService } from 'src/app/device-only/services/home-button.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { WIZARD_DEVICE_ONLY_AIS } from 'src/app/device-only/constants/wizard.constant';
import { HttpClient } from '@angular/common/http';
import { CreateOrderService } from 'src/app/device-only/services/create-order.service';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';
import { QueueService } from 'src/app/device-only/services/queue.service';
import { CustomerInformationService } from 'src/app/device-only/services/customer-information.service';

@Component({
  selector: 'app-device-only-asp-summary-page',
  templateUrl: './device-only-asp-summary-page.component.html',
  styleUrls: ['./device-only-asp-summary-page.component.scss']
})
export class DeviceOnlyAspSummaryPageComponent implements OnInit, OnDestroy {
  @ViewChild(SummarySellerCodeComponent) summarySellerCode: SummarySellerCodeComponent;
  public wizards: string[] = WIZARD_DEVICE_ONLY_AIS;
  private transaction: Transaction;
  private priceOption: PriceOption;
  public user: User;
  priceMobileCare: number;
  balance: number;
  enoughBalance: boolean;
  isShowBalance: boolean;
  isNext: boolean;

  constructor(
    private router: Router,
    private alertService: AlertService,
    private homeService: HomeService,
    private homeButtonService: HomeButtonService,
    private sellerService: SellerService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private tokenService: TokenService,
    private createOrderService: CreateOrderService,
    private sharedTransactionService: SharedTransactionService,
    private pageLoadingService: PageLoadingService,
    private queueService: QueueService,
    private http: HttpClient,
    private customerInfoService: CustomerInformationService
  ) {
    this.user = this.tokenService.getUser();
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.checkShowBalance();
    this.homeButtonService.initEventButtonHome();
    this.transaction.data.tradeType = this.priceOption.trade.tradeNo === 0 ? 'EUP' : 'Hand Set';
  }

  private checkSeller(seller: Seller): void {
    if (!seller.sellerNo) {
      this.alertService.warning('กรุณากรอกข้อมูลให้ถูกต้อง');
      return;
    }
    this.pageLoadingService.openLoading();
    this.sellerService.checkSeller(seller.sellerNo).then((shopCheckSeller: ShopCheckSeller) => {
      if (shopCheckSeller.condition === true) {
        this.transaction.data.seller = {
          ...this.transaction.data.seller,
          sellerNo: this.tokenService.getUser().ascCode ? this.tokenService.getUser().ascCode : seller.sellerNo
        };
        this.checkSellerDeviceOnlyASP(seller);
        this.redirectToFlowWeb();
      } else {
        this.alertService.warning(shopCheckSeller.message);
      }
    })
      .catch(() => {
        this.alertService.warning('ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้');
      });
  }

  private checkSellerDeviceOnlyASP(seller: Seller): void {
    if (this.transaction.data.transactionType === 'DeviceOnlyASP') {
      this.summarySellerCode.setSellerDeviceOnlyASP();
    } else {
      localStorage.removeItem('seller');
    }
  }

  public onHome(): void {
    this.homeService.goToHome();
  }

  public onBack(): void {
    if (this.customerInfoService.isNonAis === 'NON-AIS') {
      this.router.navigate([ROUTE_DEVICE_ONLY_ASP_READ_CARD_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ONLY_ASP_SELECT_MOBILE_CARE_PAGE]);
    }
  }

  public onNext(): void {
    const tradeType = this.priceOption.trade.tradeNo;
    this.transaction.data.tradeType = ((tradeType === '0') || (tradeType === null)) ? 'EUP' : 'Hand Set';
    const seller: Seller = this.summarySellerCode.getSeller();
    this.checkSeller(seller);
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

  private redirectToFlowWeb(): void {
    this.queueService.getQueueZ(this.user.locationCode)
      .then((resp: any) => {
        const queueNo = resp.data.queue;
        this.transaction.data.queue = { queueNo: queueNo };
        const device = JSON.parse(localStorage.getItem('device'));
        this.transaction.data.device.imei = device.imei;

        this.createOrderService.createOrderDeviceOnlyASP(this.transaction, this.priceOption).then((res: any) => {
          return this.sharedTransactionService.updateSharedTransaction(this.transaction, this.priceOption).then(() => {
            this.pageLoadingService.closeLoading();
            window.location.href = `/web/sales-order/pay-advance?transactionId=${this.transaction.transactionId}`;
          });
        });
      });
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }

}
