import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { ApiRequestService, PageLoadingService, HomeService, TokenService, User, AlertService } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_CARE_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CHECK_OUT_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/constants/route-path.constant';
import { Transaction, TransactionType, TransactionAction, Customer, Prebooking, Seller } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { ProductDetail } from 'mychannel-shared-libs/lib/service/models/product-detail';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { a, b } from '@angular/core/src/render3';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-summary-page',
  templateUrl: './device-order-ais-existing-best-buy-summary-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-summary-page.component.scss']
})
export class DeviceOrderAisExistingBestBuySummaryPageComponent implements OnInit, OnDestroy {

  wizards = WIZARD_DEVICE_ORDER_AIS;
  identityValid = false;
  transaction: Transaction;
  pricreOption: PriceOption;
  productDetail: ProductDetail;
  paymentResult: number;
  fullAddress: string;
  promotionPricePB: number;
  prebooking: Prebooking;
  seller: Seller;
  checkSellerForm: FormGroup;
  sellerCode: string;


  constructor(
    private router: Router,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private tokenService: TokenService,
    private http: HttpClient,
    private priceOptionService: PriceOptionService,
    public fb: FormBuilder,
    private alertService: AlertService
  ) {
    this.transaction = this.transactionService.load();
    this.pricreOption = this.priceOptionService.load();
  }


  ngOnInit() {
    this.fullAddress = this.getFullAddress(this.transaction.data.customer);
    this.paymentResult = this.getPromotionPrice() + this.getPackagePrice();
    const user = this.tokenService.getUser();

    this.http.get(`/api/salesportal/location-by-code?code=${user.locationCode}`).toPromise().then((response: any) => {
      this.seller = {
        sellerName: user.firstname && user.lastname ? `${user.firstname} ${user.lastname}` : user.username,
        locationName: response.data.displayName,
        locationCode: user.locationCode
      };
    });

    if (this.prebooking && this.prebooking.preBookingNo) {
      this.paymentResult = this.paymentResult - +this.prebooking.depositAmt;
      this.promotionPricePB = this.getPromotionPrice() - +this.prebooking.depositAmt;
    }
    this.createForm();

  }

  onHome() {
    this.homeService.goToHome();
  }

  onBack() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_CARE_PAGE]);
  }

  onNext() {
    this.pageLoadingService.openLoading();
    this.http.get(`/api/customerportal/checkSeller/${this.sellerCode}`).toPromise()
    .then((shopCheckSeller: any) => {
      if (shopCheckSeller.condition) {
        this.transaction.data.seller.employeeId = shopCheckSeller.isAscCode;
          this.pageLoadingService.closeLoading();
          this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CHECK_OUT_PAGE]);
        } else {
          this.alertService.error(shopCheckSeller.message);
        }
      }).catch((error: any) => {
        this.pageLoadingService.closeLoading();
        this.alertService.error('ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้');
      });
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  getPromotionPrice(): number {
    const promotionPrice: number  = this.transaction.data.mainPromotion.trade.promotionPrice;
    return promotionPrice;
  }

  getPackagePrice(): number {
    const packagePrice: number  = this.transaction.data.mainPromotion.trade.advancePay.amount;
    return packagePrice;
  }

  getFullAddress(customer: Customer) {
    if (customer) {
      const fullAddress =
        (customer.homeNo ? customer.homeNo + ' ' : '') +
        (customer.moo ? 'หมู่ที่ ' + customer.moo + ' ' : '') +
        (customer.mooBan ? 'หมู่บ้าน ' + customer.mooBan + ' ' : '') +
        (customer.room ? 'ห้อง ' + customer.room + ' ' : '') +
        (customer.floor ? 'ชั้น ' + customer.floor + ' ' : '') +
        (customer.buildingName ? 'อาคาร ' + customer.buildingName + ' ' : '') +
        (customer.soi ? 'ซอย ' + customer.soi + ' ' : '') +
        (customer.street ? 'ถนน ' + customer.street + ' ' : '') +
        (customer.tumbol ? 'ตำบล/แขวง ' + customer.tumbol + ' ' : '') +
        (customer.amphur ? 'อำเภอ/เขต ' + customer.amphur + ' ' : '') +
        (customer.province ? 'จังหวัด ' + customer.province + ' ' : '') +
        (customer.zipCode || '');
      return fullAddress || '-';
    } else {
      return '-';
    }
  }

  createForm() {
    this.checkSellerForm = this.fb.group({
      checkSeller: ['', Validators.required]
    });

    this.checkSellerForm.valueChanges.subscribe((value) => {
      console.log(value.checkSeller);
      if (value.checkSeller) {
        this.identityValid = true;
        this.sellerCode = value.checkSeller;
      }
    });
  }

}
