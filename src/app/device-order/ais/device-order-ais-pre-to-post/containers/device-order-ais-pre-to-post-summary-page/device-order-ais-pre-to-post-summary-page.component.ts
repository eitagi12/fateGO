import { Component, OnInit, ViewChild } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Router } from '@angular/router';
import { HomeService, ShoppingCart, Utils } from 'mychannel-shared-libs';
import {
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_MOBILE_CARE_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_ECONTRACT_PAGE
} from '../../constants/route-path.constant';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { SummaryPageService } from 'src/app/device-order/services/summary-page.service';

@Component({
  selector: 'app-device-order-ais-pre-to-post-summary-page',
  templateUrl: './device-order-ais-pre-to-post-summary-page.component.html',
  styleUrls: ['./device-order-ais-pre-to-post-summary-page.component.scss']
})
export class DeviceOrderAisPreToPostSummaryPageComponent implements OnInit {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;

  @ViewChild('detailTemplate')
  detailTemplate: any;
  modalRef: BsModalRef;
  detail: string;

  priceOption: PriceOption;
  transaction: Transaction;
  shoppingCart: ShoppingCart;
  customerAddress: string;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private priceOptionService: PriceOptionService,
    private transactionService: TransactionService,
    private shoppingCartService: ShoppingCartService,
    private modalService: BsModalService,
    public summaryPageService: SummaryPageService,
    private utils: Utils
  ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();
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
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_MOBILE_CARE_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_ECONTRACT_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onOpenDetail(detail: string): void {
    this.detail = detail;
    this.modalRef = this.modalService.show(this.detailTemplate);
  }

  summary(amount: number[]): number {
    return amount.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  }
}