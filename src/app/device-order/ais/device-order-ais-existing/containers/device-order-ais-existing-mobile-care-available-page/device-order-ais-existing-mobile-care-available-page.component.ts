import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, ShoppingCart, ProductStock } from 'mychannel-shared-libs';
import {
  ROUTE_DEVICE_ORDER_AIS_EXISTING_MOBILE_CARE_PAGE,
  ROUTE_DEVICE_ORDER_AIS_EXISTING_EFFECTIVE_START_DATE_PAGE,
  ROUTE_DEVICE_ORDER_AIS_EXISTING_SUMMARY_PAGE,
  ROUTE_DEVICE_ORDER_AIS_EXISTING_MOBILE_CARE_AVAILABLE_PAGE,
  ROUTE_DEVICE_ORDER_AIS_EXISTING_SELECT_PACKAGE_ONTOP_PAGE
} from '../../constants/route-path.constant';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { Transaction, ExistingMobileCare } from 'src/app/shared/models/transaction.model';

@Component({
  selector: 'app-device-order-ais-existing-mobile-care-available-page',
  templateUrl: './device-order-ais-existing-mobile-care-available-page.component.html',
  styleUrls: ['./device-order-ais-existing-mobile-care-available-page.component.scss']
})
export class DeviceOrderAisExistingMobileCareAvailablePageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;

  transaction: Transaction;
  identityValid: boolean;
  shoppingCart: ShoppingCart;
  exMobileCare: ExistingMobileCare;
  productStock: ProductStock;
  exMobileCareForm: FormGroup;
  changeMobileCare: boolean;
  priceOption: PriceOption;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    public fb: FormBuilder,
    private shoppingCartService: ShoppingCartService,
    private priceOptionService: PriceOptionService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
    this.exMobileCare = this.transaction.data.existingMobileCare;
    this.productStock = this.priceOption.productStock;
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    this.createForm();
  }

  onBack(): void {
    const deleteOntopPackage = this.transaction.data.deleteOntopPackage;
    if (deleteOntopPackage && deleteOntopPackage.length > 0) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_SELECT_PACKAGE_ONTOP_PAGE]);
    } else if (!this.transaction.data.mainPackage) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_MOBILE_CARE_AVAILABLE_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_EFFECTIVE_START_DATE_PAGE]);
    }
  }

  onNext(): void {
    this.router.navigate([this.checkRouteByChangeMobileCare()]);
  }

  checkRouteByChangeMobileCare(): string {
    if (this.changeMobileCare) {
      return ROUTE_DEVICE_ORDER_AIS_EXISTING_MOBILE_CARE_PAGE;
    } else {
      return ROUTE_DEVICE_ORDER_AIS_EXISTING_SUMMARY_PAGE;
    }
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  createForm(): void {
    this.exMobileCareForm = this.fb.group({
      changeMobileCare: ['', Validators.required]
    });
    this.exMobileCareForm.valueChanges.subscribe((value) => this.checkChangeMobileCare(value));
  }

  checkChangeMobileCare(value: any): void {
    if (value.changeMobileCare === 'Yes') {
      this.changeMobileCare = true;
    } else {
      this.transaction.data.mobileCarePackage = null;
      this.changeMobileCare = false;
    }
    this.identityValid = true;
  }
}
