import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { ApiRequestService, PageLoadingService, HomeService, TokenService, User } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_CARE_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CHECK_OUT_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/constants/route-path.constant';
import { Transaction, TransactionType, TransactionAction, Customer, Prebooking, Seller } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { ProductDetail } from 'mychannel-shared-libs/lib/service/models/product-detail';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { a, b } from '@angular/core/src/render3';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-summary-page',
  templateUrl: './device-order-ais-existing-best-buy-summary-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-summary-page.component.scss']
})
export class DeviceOrderAisExistingBestBuySummaryPageComponent implements OnInit, OnDestroy {

  wizards = WIZARD_DEVICE_ORDER_AIS;
  identityValid = true;
  transaction: Transaction;
  pricreOption: PriceOption;
  productDetail: ProductDetail;
  paymentResult: number;
  customer: Customer;
  fullAddress: string;
  promotionPricePB: number;
  prebooking: Prebooking;
  seller: Seller;


  constructor(
    private router: Router,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private tokenService: TokenService,
    private apiRequestService: ApiRequestService,
    private http: HttpClient,
    private priceOptionService: PriceOptionService
  ) {
    this.transaction = this.transactionService.load();
    this.pricreOption = this.priceOptionService.load();
  }


  ngOnInit() {
    this.customer = this.transaction.data.customer;
    this.fullAddress = this.getFullAddress(this.customer);
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


  }

  onHome() {
    this.homeService.goToHome();
  }

  onBack() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_CARE_PAGE]);
  }

  onNext() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CHECK_OUT_PAGE]);
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

}
