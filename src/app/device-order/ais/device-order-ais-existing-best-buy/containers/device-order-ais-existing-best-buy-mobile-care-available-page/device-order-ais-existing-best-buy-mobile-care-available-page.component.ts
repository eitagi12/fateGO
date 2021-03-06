import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { HomeService, PageLoadingService, ApiRequestService, ShoppingCart, ProductStock } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_PAYMENT_DETAIL_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_CARE_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SUMMARY_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/constants/route-path.constant';
import { Transaction, ExistingMobileCare } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-mobile-care-available-page',
  templateUrl: './device-order-ais-existing-best-buy-mobile-care-available-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-mobile-care-available-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyMobileCareAvailablePageComponent implements OnInit, OnDestroy {

  wizards: any = WIZARD_DEVICE_ORDER_AIS;
  reason: any = 'ยืนยันใช้ Mobile Care กับเครื่องเดิม';

  identityValid: boolean = false;
  transaction: Transaction;
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

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_PAYMENT_DETAIL_PAGE]);
  }

  onNext(): void {
    this.transaction.data.existingMobileCare.changeMobileCareFlag = this.changeMobileCare;
    if (this.changeMobileCare) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_CARE_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SUMMARY_PAGE]);
    }
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  createForm(): void {
    this.exMobileCareForm = this.fb.group({
      changeMobileCare: ['', Validators.required]
    });

    this.exMobileCareForm.valueChanges.subscribe((value) => {
      if (value.changeMobileCare === 'Yes') {
        this.changeMobileCare = true;
      } else {
        this.transaction.data.mobileCarePackage = this.reason;
        this.changeMobileCare = false;
      }
      this.identityValid = true;
    });
  }
}
