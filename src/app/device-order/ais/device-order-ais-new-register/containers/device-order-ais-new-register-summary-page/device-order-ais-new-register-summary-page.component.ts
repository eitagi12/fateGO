import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Router } from '@angular/router';
import { HomeService, ShoppingCart, Utils } from 'mychannel-shared-libs';
import {
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_MOBILE_CARE_PAGE,
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_ECONTACT_PAGE
} from 'src/app/device-order/ais/device-order-ais-new-register/constants/route-path.constant';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { SummaryPageService } from 'src/app/device-order/services/summary-page.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { QrCodeOmisePageService } from 'src/app/device-order/services/qr-code-omise-page.service';

@Component({
  selector: 'app-device-order-ais-new-register-summary-page',
  templateUrl: './device-order-ais-new-register-summary-page.component.html',
  styleUrls: ['./device-order-ais-new-register-summary-page.component.scss']
})
export class DeviceOrderAisNewRegisterSummaryPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;

  @ViewChild('detailTemplate')
  detailTemplate: any;
  modalRef: BsModalRef;
  detail: string;

  priceOption: PriceOption;
  transaction: Transaction;
  shoppingCart: ShoppingCart;
  customerAddress: string;
  translateSubscription: Subscription;

  currentLang: string;
  constructor(
    private router: Router,
    private homeService: HomeService,
    private priceOptionService: PriceOptionService,
    private transactionService: TransactionService,
    private shoppingCartService: ShoppingCartService,
    private modalService: BsModalService,
    public qrCodeOmisePageService: QrCodeOmisePageService,
    public summaryPageService: SummaryPageService,
    private utils: Utils,
    private translateService: TranslateService
  ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();

    this.currentLang = this.translateService.currentLang || 'TH';
    this.translateSubscription = this.translateService.onLangChange.subscribe(lang => {
      this.currentLang = typeof (lang) === 'object' ? lang.lang : lang;
    });
  }

  ngOnInit(): void {
    const customer = this.transaction.data.customer;

    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    this.customerAddress = this.utils.getCurrentAddress({
      homeNo: customer.homeNo,
      moo: customer.moo,
      room: customer.room,
      floor: customer.floor,
      buildingName: customer.buildingName,
      soi: customer.soi,
      street: customer.street,
      tumbol: customer.tumbol,
      amphur: customer.amphur,
      province: customer.province,
      zipCode: customer.zipCode
    });
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_MOBILE_CARE_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_ECONTACT_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onOpenDetail(detail: any): void {
    this.detail = detail;
    this.modalRef = this.modalService.show(this.detailTemplate);
  }

  mainPackageTitle(detail: any): string {
    return (this.translateService.currentLang === 'EN') ? detail.shortNameEng : detail.shortNameThai;
  }

  summary(amount: number[]): number {
    return amount.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  }

  ngOnDestroy(): void {
    if (this.translateSubscription) {
      this.translateSubscription.unsubscribe();
    }
    this.transactionService.update(this.transaction);
  }
}
