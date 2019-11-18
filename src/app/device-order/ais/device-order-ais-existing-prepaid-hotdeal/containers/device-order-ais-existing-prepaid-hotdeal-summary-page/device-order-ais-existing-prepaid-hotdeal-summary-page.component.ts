import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, ShoppingCart, PageLoadingService, AlertService } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_MOBILE_CARE_PAGE, ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_AGGREGATE_PAGE, ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_MOBILE_CARE_AVAILABLE_PAGE } from '../../constants/route-path.constant';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { Transaction, Seller } from 'src/app/shared/models/transaction.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { SummaryPageService } from 'src/app/device-order/services/summary-page.service';
import { TranslateService } from '@ngx-translate/core';
import { QrCodeOmisePageService } from 'src/app/device-order/services/qr-code-omise-page.service';

@Component({
  selector: 'app-device-order-ais-existing-prepaid-hotdeal-summary-page',
  templateUrl: './device-order-ais-existing-prepaid-hotdeal-summary-page.component.html',
  styleUrls: ['./device-order-ais-existing-prepaid-hotdeal-summary-page.component.scss']
})
export class DeviceOrderAisExistingPrepaidHotdealSummaryPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;

  transaction: Transaction;
  priceOption: PriceOption;
  shoppingCart: ShoppingCart;
  getBalanceSubscription: Promise<any>;

  @ViewChild('detailTemplate')
  detailTemplate: any;
  modalRef: BsModalRef;
  detail: string;

  customerAddress: string;
  deposit: number;
  sellerCode: string;
  checkSellerForm: FormGroup;
  seller: Seller;
  balance: any;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private http: HttpClient,
    private priceOptionService: PriceOptionService,
    public fb: FormBuilder,
    private alertService: AlertService,
    private modalService: BsModalService,
    public qrCodeOmisePageService: QrCodeOmisePageService,
    private shoppingCartService: ShoppingCartService,
    public summaryPageService: SummaryPageService,
    private translateService: TranslateService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
  }

  ngOnInit(): void {
    this.getBalance();
  }

  getBalance(): void {
    const simcard = this.transaction.data.simCard;
    const onTopPackage = this.transaction.data.onTopPackage;
    const mobileCarePackage = this.transaction.data.mobileCarePackage;

    this.pageLoadingService.openLoading();
    this.balance = {  balance: 0, addMoney: true, addMoneyPrice: 0 };
    this.getBalanceSubscription = this.http.get(`/api/customerportal/newRegister/${simcard.mobileNo}/getBalance`).toPromise();

    this.getBalanceSubscription.then((resp: any) => {
      this.pageLoadingService.closeLoading();
      const remainingBalance = Number(resp.data.remainingBalance) / 100;
      let money = 0;
      if (typeof (mobileCarePackage) === 'object') {
        money = Number(onTopPackage.priceIncludeVat) + Number(mobileCarePackage.customAttributes.priceInclVat);
      } else {
        money = Number(onTopPackage.priceIncludeVat);
      }
      const addMoney = !!((remainingBalance - money) < 0);
      const addMoneyPrice = (remainingBalance - money) >= 0 ? 0 : money - remainingBalance;
      this.balance = {  balance: remainingBalance, addMoney: addMoney, addMoneyPrice: addMoneyPrice };
    })
    .catch((err: any) => {
      this.pageLoadingService.closeLoading();
    });
  }

  addMoneyPriceText(value: any = {}): string {
    if (this.translateService.currentLang === 'EN') {
      return `The remaining balance is ${+value.balance.toFixed(2)} THB
      please top up the amount ${+value.addMoneyPrice.toFixed(2)} THB to purchase a package
      then press "Refresh" after topping up`;
    } else {
      return `ยอดเงินคงเหลือ ${+value.balance.toFixed(2)} บาท
      กรุณาเติมเงินเพิ่ม ${+value.addMoneyPrice.toFixed(2)} บาท เพื่อสมัครแพ็กเกจ
      * เมื่อเติมเงินเรียบร้อยแล้ว กรุณากดปุ่ม "Refresh"`;
    }
  }

  getSummaryPrice(): number {
    const onTopPack = this.transaction.data.onTopPackage.priceIncludeVat;
    const promotion = this.priceOption.trade.promotionPrice;
    const existingMobileCare = this.transaction.data.existingMobileCare;
    const mobileCarePackage = this.transaction.data.mobileCarePackage;
    if (typeof (mobileCarePackage) === 'object') {
      return Number(onTopPack) + Number(promotion) + Number(mobileCarePackage.customAttributes.priceInclVat);
    } else {
      return Number(onTopPack) + Number(promotion);
    }
  }

  summary(amount: number[]): number {
    return amount.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  }

  onOpenDetail(detail: any = {}): void {
    this.detail = this.translateService.currentLang === 'EN'
    ? (detail.descriptionEng || detail.detailEN) : (detail.descriptionThai || detail.detailTH) || '';
    this.modalRef = this.modalService.show(this.detailTemplate);
  }

  packageTitle(detail: any = {}): string {
    return (this.translateService.currentLang === 'EN')
    ? (detail.shortNameEng || detail.titleEng) : (detail.shortNameThai || detail.title) || '';
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    const saveIdCardImageRequest: any = {
      mobileNo: this.transaction.data.simCard.mobileNo || '',
      idCardNo: this.transaction.data.customer.idCardNo,
      imageReadSmartCard:  this.transaction.data.customer.imageReadSmartCard.replace('data:image/jpg;base64,', '') || '',
      imageTakePhoto: '' // flow prepaid ไม่มีถ่ายรูป
    };
    this.http.post('/api/customerportal/saveIdcardImage' , saveIdCardImageRequest).toPromise()
    .then(() => {
      this.pageLoadingService.closeLoading();
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_AGGREGATE_PAGE]);
    });
  }

  onBack(): void {
    const mobileCare = this.transaction.data.mobileCarePackage;
    if (mobileCare) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_MOBILE_CARE_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_MOBILE_CARE_AVAILABLE_PAGE]);
    }
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}
