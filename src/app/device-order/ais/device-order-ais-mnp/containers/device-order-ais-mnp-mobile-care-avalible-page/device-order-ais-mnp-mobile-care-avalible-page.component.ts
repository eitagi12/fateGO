import { Component, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, ShoppingCart } from 'mychannel-shared-libs';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { ROUTE_DEVICE_ORDER_AIS_MNP_SUMMARY_PAGE, ROUTE_DEVICE_ORDER_AIS_MNP_MOBILE_CARE_PAGE, ROUTE_DEVICE_ORDER_AIS_MNP_EFFECTIVE_START_DATE_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-mnp-mobile-care-avalible-page',
  templateUrl: './device-order-ais-mnp-mobile-care-avalible-page.component.html',
  styleUrls: ['./device-order-ais-mnp-mobile-care-avalible-page.component.scss']
})
export class DeviceOrderAisMnpMobileCareAvaliblePageComponent implements OnInit, OnChanges, OnDestroy {

  shoppingCart: ShoppingCart;
  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;
  mobileNoSelect: string;

  priceOption: PriceOption;
  transaction: Transaction;
  selectedChanged: boolean;

  changeMobileCareForm: FormGroup;

  choices: any = [{
    text: 'ใช่',
    value: true
  }, {
    text: 'ไม่ใช่',
    value: false
  }];

  constructor(
    private router: Router,
    private homeService: HomeService,
    private priceOptionService: PriceOptionService,
    private transactionService: TransactionService,
    private shoppingCartService: ShoppingCartService,
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
  }

  ngOnInit(): void {
    this.createForm();
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_EFFECTIVE_START_DATE_PAGE]);
  }

  onNext(): void {
    if (this.selectedChanged) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_MOBILE_CARE_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_SUMMARY_PAGE]);
    }
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  createForm(): void {
    this.changeMobileCareForm = this.fb.group({
      isChange: [null, Validators.required]
    });
    this.changeMobileCareForm.valueChanges.subscribe(observer => {
      this.selectedChanged = observer.isChange;
    });

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.changeMobileCareForm) {
      this.changeMobileCareForm.patchValue({
        isChange: this.selectedChanged
      });
    }
  }

  checked(value: string): boolean {
    return JSON.stringify(value) === JSON.stringify(this.selectedChanged);
  }

}
