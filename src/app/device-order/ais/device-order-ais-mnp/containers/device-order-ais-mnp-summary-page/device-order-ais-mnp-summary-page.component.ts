import { Component, OnInit, ViewChild } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { ShoppingCart, HomeService, Utils } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { ROUTE_DEVICE_ORDER_AIS_MNP_MOBILE_CARE_PAGE, ROUTE_DEVICE_ORDER_AIS_MNP_ECONTACT_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-mnp-summary-page',
  templateUrl: './device-order-ais-mnp-summary-page.component.html',
  styleUrls: ['./device-order-ais-mnp-summary-page.component.scss']
})
export class DeviceOrderAisMnpSummaryPageComponent implements OnInit {

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
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_MOBILE_CARE_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_ECONTACT_PAGE]);
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
