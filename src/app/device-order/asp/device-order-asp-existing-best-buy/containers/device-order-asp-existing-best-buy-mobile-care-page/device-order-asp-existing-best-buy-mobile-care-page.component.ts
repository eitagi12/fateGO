import { Component, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { ApiRequestService, PageLoadingService, HomeService, MobileCare, ShoppingCart, BillingSystemType, VAT } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_ASP_BEST_BUY_MOBILE_CARE_AVAILABLE_PAGE, ROUTE_DEVICE_ORDER_ASP_BEST_BUY_SUMMARY_PAGE, ROUTE_DEVICE_ORDER_ASP_BEST_BUY_PAYMENT_DETAIL_PAGE } from 'src/app/device-order/asp/device-order-asp-existing-best-buy/constants/route-path.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { MobileCareService } from 'src/app/device-order/services/mobile-care.service';
import { MOBILE_CARE_PACKAGE_KEY_REF } from 'src/app/device-order/constants/cpc.constant';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-device-order-asp-existing-best-buy-mobile-care-page',
  templateUrl: './device-order-asp-existing-best-buy-mobile-care-page.component.html',
  styleUrls: ['./device-order-asp-existing-best-buy-mobile-care-page.component.scss']
})
export class DeviceOrderAspExistingBestBuyMobileCarePageComponent implements OnInit, OnDestroy {

  wizards: any = WIZARD_DEVICE_ORDER_AIS;

  identityValid: boolean = true;
  transaction: Transaction;
  mobileCare: MobileCare;
  priceOption: PriceOption;
  shoppingCart: ShoppingCart;

  @ViewChild('template')
  template: TemplateRef<any>;
  modalRef: BsModalRef;

  mobileCareForm: FormGroup;
  notBuyMobileCareForm: FormGroup;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private apiRequestService: ApiRequestService,
    private http: HttpClient,
    private priceOptionService: PriceOptionService,
    private shoppingCartService: ShoppingCartService,
    private mobileCareService: MobileCareService,
    private fb: FormBuilder,
    private modalService: BsModalService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    delete this.transaction.data.mobileCarePackage;
    this.callService();
    this.createForm();
  }

  // onCompleted(mobileCare: any) {
  //   this.transaction.data.mobileCarePackage = mobileCare;
  // }

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): void {
    if (this.transaction.data.existingMobileCare) {
      this.router.navigate([ROUTE_DEVICE_ORDER_ASP_BEST_BUY_MOBILE_CARE_AVAILABLE_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_ASP_BEST_BUY_PAYMENT_DETAIL_PAGE]);
    }
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_ASP_BEST_BUY_SUMMARY_PAGE]);
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  callService(): void {
    const billingSystem = this.transaction.data.simCard.billingSystem || BillingSystemType.IRB;
    const chargeType = this.transaction.data.simCard.chargeType;
    const endUserPrice = +this.priceOption.trade.normalPrice;
    const exMobileCare = this.transaction.data.existingMobileCare;

    this.pageLoadingService.openLoading();
    this.mobileCareService.getMobileCare({
      packageKeyRef: MOBILE_CARE_PACKAGE_KEY_REF,
      billingSystem: billingSystem
    }, chargeType, billingSystem, endUserPrice).then((mobileCare: any) => {
      this.mobileCare = {
        promotions: mobileCare,
        // campaignPrice: 0
        existingMobileCare: exMobileCare ? true : false
      };
      if (this.mobileCare.promotions && this.mobileCare.promotions.length > 0) {
        this.mobileCare.promotions[0].active = true;
      }
    })
      .then(() => this.pageLoadingService.closeLoading());
  }

  createForm(): void {
    this.mobileCareForm = this.fb.group({
      'mobileCare': [true, Validators.required],
      'promotion': ['', Validators.required]
    });

    this.notBuyMobileCareForm = this.fb.group({
      'notBuyMobile': [''],
    });

    this.mobileCareForm.valueChanges.subscribe((value: any) => {
      if (!value.mobileCare) {
        return this.onOpenNotBuyMobileCare();
      } else {
        this.notBuyMobileCareForm.patchValue({
          notBuyMobile: ''
        });
      }
      if (this.mobileCareForm.valid) {
        this.transaction.data.mobileCarePackage = this.mobileCareForm.value.promotion.value;
      }
    });
  }

  getServiceChange(percentage: number): number {
    return ((this.priceOption.trade.normalPrice || 0) * (percentage / 100) * (VAT / 100));
  }

  onOpenNotBuyMobileCare(): void {
    this.modalRef = this.modalService.show(this.template, {
      ignoreBackdropClick: true
    });
  }

  onNotBuyMobileCare(dismiss: boolean): void {
    if (dismiss) { // cancel
      this.mobileCareForm.patchValue({
        mobileCare: true
      });
    } else {
      this.transaction.data.mobileCarePackage = { reason: this.notBuyMobileCareForm.value.notBuyMobile };
    }
    this.modalRef.hide();
  }
}
