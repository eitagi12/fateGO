import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Seller, Transaction, Customer } from 'src/app/shared/models/transaction.model';
import { SummarySellerCodeComponent } from 'src/app/device-only/components/summary-seller-code/summary-seller-code.component';
import { AlertService, TokenService, User, HomeService, PageLoadingService } from 'mychannel-shared-libs';
import { SellerService } from 'src/app/device-only/services/seller.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Router } from '@angular/router';
import { ROUTE_DEVICE_ONLY_ASP_CHECKOUT_PAYMENT_PAGE, ROUTE_DEVICE_ONLY_ASP_SELECT_MOBILE_CARE_PAGE } from '../../constants/route-path.constant';
import { ShopCheckSeller } from 'src/app/device-only/models/shopCheckSeller.model';
import { HomeButtonService } from 'src/app/device-only/services/home-button.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { WIZARD_DEVICE_ONLY_AIS } from 'src/app/device-only/constants/wizard.constant';
import { HttpClient } from '@angular/common/http';
import { CreateOrderService } from 'src/app/device-only/services/create-order.service';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';
import { QueueService } from 'src/app/device-only/services/queue.service';

@Component({
  selector: 'app-device-only-asp-summary-page',
  templateUrl: './device-only-asp-summary-page.component.html',
  styleUrls: ['./device-only-asp-summary-page.component.scss']
})
export class DeviceOnlyAspSummaryPageComponent implements OnInit, OnDestroy {
  @ViewChild(SummarySellerCodeComponent) summarySellerCode: SummarySellerCodeComponent;
  public wizards: string[] = WIZARD_DEVICE_ONLY_AIS;
  public isNext: boolean;
  private transaction: Transaction;
  private priceOption: PriceOption;
  public user: User;

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
    private http: HttpClient
  ) {
    this.user = this.tokenService.getUser();
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.homeButtonService.initEventButtonHome();
    this.transaction.data.tradeType = this.priceOption.trade.tradeNo === 0 ? 'EUP' : 'Hand Set';
  }

  private checkSeller(seller: Seller): void {
    if (!seller.sellerNo) {
      this.alertService.warning('กรุณากรอกข้อมูลให้ถูกต้อง');
      return;
    }
    this.sellerService.checkSeller(seller.sellerNo).then((shopCheckSeller: ShopCheckSeller) => {
      if (shopCheckSeller.condition) {
        if (!this.transaction.data.seller) {
          this.transaction.data.seller = {
            sellerNo: seller.sellerNo,
            locationCode: this.tokenService.getUser().locationCode
          };
        } else {
          this.transaction.data.seller.sellerNo = seller.sellerNo;
        }
        this.redirectToFlowWeb();
      } else {
        this.alertService.warning(shopCheckSeller.message);
      }
    })
      .catch(() => {
        this.alertService.warning('ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้');
      });
  }

  private checkRoutePaymentType(): void {
    this.router.navigate([ROUTE_DEVICE_ONLY_ASP_CHECKOUT_PAYMENT_PAGE]);
  }

  public conditionNext(canNext: boolean): void {
    this.isNext = canNext;
  }

  public onHome(): void {
    this.homeService.goToHome();
  }

  public onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ONLY_ASP_SELECT_MOBILE_CARE_PAGE]);
  }

  public onNext(): void {
    const tradeType = this.priceOption.trade.tradeNo;
    this.transaction.data.tradeType = ((tradeType === '0') || (tradeType === null)) ? 'EUP' : 'Hand Set';
    const seller: Seller = this.summarySellerCode.getSeller();
    this.checkSeller(seller);
  }

  private redirectToFlowWeb(): void {
    this.queueService.getQueueZ(this.user.locationCode)
      .then((resp: any) => {
        const queueNo = resp.data.queue;
        this.transaction.data.queue = { queueNo: queueNo };
        const device = JSON.parse(localStorage.getItem('device'));
        this.transaction.data.device.imei = device.imei;
        // tslint:disable-next-line: max-line-length
        const sellerNo = (this.transaction.data.seller && this.transaction.data.seller.sellerNo) ? this.transaction.data.seller.sellerNo : '';
        const order = {
          soId: this.transaction.data.order.soId,
          soCompany: this.priceOption.productStock.company,
          locationSource: this.user.locationCode,
          locationReceipt: this.user.locationCode,
          productType: this.priceOption.productDetail.productType,
          productSubType: this.priceOption.productDetail.productSubtype,
          brand: this.priceOption.productDetail.brand,
          model: this.priceOption.productDetail.model,
          color: this.priceOption.productStock.colorName,
          matCode: this.priceOption.productStock.colorCode,
          priceIncAmt: (+this.priceOption.trade.normalPrice).toFixed(2),
          priceDiscountAmt: (+this.priceOption.trade.priceDiscount).toFixed(2),
          grandTotalAmt: (+this.priceOption.trade.normalPrice - +this.priceOption.trade.priceDiscount).toFixed(2),
          userId: this.user.username,
          saleCode: sellerNo,
          queueNo: this.transaction.data.queue.queueNo,
          cusNameOrder: this.transaction.data.customer.firstName + ' ' + this.transaction.data.customer.lastName,
          taxCardId: this.transaction.data.customer.idCardNo,
          customerAddress: this.mapCusAddress(this.transaction.data.customer),
          tradeNo: this.priceOption.trade.tradeNo,
          reqMinimumBalance: this.transaction.data.simCard ?
                             this.getReqMinimumBalance(this.transaction, this.transaction.data.mobileCarePackage) : '',
          tradeType: this.transaction.data.tradeType
        };
        return this.http.post('/api/salesportal/create-device-selling-order', order).toPromise()
          .then(() => {
            this.sharedTransactionService.updateSharedTransaction(this.transaction, this.priceOption).then(() => {
              this.pageLoadingService.closeLoading();
              window.location.href = `/web/sales-order/pay-advance?transactionId=${this.transaction.transactionId}`;
            });
        });
      });
  }

  mapCusAddress(addressCus: Customer): any {
    return {
      addrNo: addressCus ? addressCus.homeNo : '',
      moo: addressCus ? addressCus.moo : '',
      mooban: addressCus ? addressCus.mooBan : '',
      buildingName: addressCus ? addressCus.buildingName : '',
      floor: addressCus ? addressCus.floor : '',
      room: addressCus ? addressCus.room : '',
      soi: addressCus ? addressCus.soi : '',
      streetName: addressCus ? addressCus.street : '',
      tumbon: addressCus ? addressCus.tumbol : '',
      amphur: addressCus ? addressCus.amphur : '',
      province: addressCus ? addressCus.province : '',
      postCode: addressCus ? addressCus.zipCode : '',
      country: 'THA'
    };
  }

  private getReqMinimumBalance(transaction: Transaction, mobileCarePackage: any): number { // Package only
    if (transaction.data.simCard.chargeType === 'Pre-paid') {
    let total: number = 0;
    if (mobileCarePackage && mobileCarePackage.customAttributes) {
      const customAttributes = mobileCarePackage.customAttributes;
      total += +(customAttributes.priceInclVat || 0);
      }
    return total;
    }
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }

}
