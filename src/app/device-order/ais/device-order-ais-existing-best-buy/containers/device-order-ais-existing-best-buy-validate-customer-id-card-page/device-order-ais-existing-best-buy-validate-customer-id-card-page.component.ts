import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { PageLoadingService, HomeService, ReadCardProfile,
  User, AlertService, ValidateCustomerIdCardComponent, TokenService } from 'mychannel-shared-libs';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CUSTOMER_INFO_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_VALIDATE_CUSTOMER_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/constants/route-path.constant';
import { Transaction, Customer, Prebooking } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';
import { CustomerInfoService } from 'src/app/device-order/services/customer-info.service';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-validate-customer-id-card-page',
  templateUrl: './device-order-ais-existing-best-buy-validate-customer-id-card-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-validate-customer-id-card-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyValidateCustomerIdCardPageComponent implements OnInit, OnDestroy {

  kioskApi: boolean;

  transaction: Transaction;
  profile: ReadCardProfile;
  zipcode: string;
  readCardValid: boolean;
  priceOption: PriceOption;
  user: User;
  billDeliveryAddress: Customer;

  @ViewChild(ValidateCustomerIdCardComponent)
  validateCustomerIdcard: ValidateCustomerIdCardComponent;

  constructor(
    private router: Router,
    private http: HttpClient,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private alertService: AlertService,
    private customerInfoService: CustomerInfoService,
    private priceOptionService: PriceOptionService,
    private sharedTransactionService: SharedTransactionService,
    private tokenService: TokenService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.user = this.tokenService.getUser();
  }

  ngOnInit(): void {
  }

  onError(valid: boolean): void {
    this.readCardValid = valid;
    if (!this.profile) {
      this.alertService.error('ไม่สามารถอ่านบัตรประชาชนได้ กรุณาติดต่อพนักงาน');
      this.validateCustomerIdcard.koiskApiFn.removedState().subscribe((removed: boolean) => {
        if (removed) {
          this.validateCustomerIdcard.ngOnDestroy();
          this.validateCustomerIdcard.ngOnInit();
        }
      });

    }
  }

  onCompleted(profile: ReadCardProfile): void {
    this.profile = profile;
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    this.transaction.data.customer = this.profile;
    this.customerInfoService.getProvinceId(this.profile.province).then((provinceId: string) => {
      return this.customerInfoService.getZipCode(provinceId, this.profile.amphur, this.profile.tumbol)
        .then((zipCode: string) => {
          return this.customerInfoService.getCustomerInfoByIdCard(this.profile.idCardNo).then((customer: Customer) => {
            return {
              caNumber: customer.caNumber,
              mainMobile: customer.mainMobile,
              billCycle: customer.billCycle,
              zipCode: zipCode
            };
          }).catch(() => {
            return { zipCode: zipCode };
          });
        }).then((customer: any) => {
          if (customer.caNumber) {
            this.transaction.data.customer = { ...this.profile, ...customer };
          } else {
            this.transaction.data.customer.zipCode = customer.zipCode;
          }
          this.transaction.data.billingInformation = {};
          this.transaction.data.billingInformation.billDeliveryAddress = this.transaction.data.customer;
          if (this.transaction.data.order && this.transaction.data.order.soId) {
            this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CUSTOMER_INFO_PAGE]);
            return;
          }
          return this.http.post('/api/salesportal/add-device-selling-cart',
            this.getRequestAddDeviceSellingCart()
          ).toPromise().then((resp: any) => {
            this.transaction.data.order = { soId: resp.data.soId };
            return this.sharedTransactionService.createSharedTransaction(this.transaction, this.priceOption);
          }).then(() => {
            this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CUSTOMER_INFO_PAGE]);
          });
        });
    }).catch((e) => this.alertService.error(e))
    .then(() => this.pageLoadingService.closeLoading());
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_VALIDATE_CUSTOMER_PAGE]);
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  getRequestAddDeviceSellingCart(): any {
    const productStock = this.priceOption.productStock;
    const productDetail = this.priceOption.productDetail;
    const customer = this.transaction.data.customer;
    const trade = this.priceOption.trade;
    const preBooking: Prebooking = this.transaction.data.preBooking;
    let subStock;
    if (preBooking && preBooking.preBookingNo) {
      subStock = 'PRE';
    }
    return {
      soCompany: productStock.company || 'AWN',
      locationSource: this.user.locationCode,
      locationReceipt: this.user.locationCode,
      productType: productDetail.productType || 'DEVICE',
      productSubType: productDetail.productSubType || 'HANDSET',
      brand: productDetail.brand || productStock.brand,
      model: productDetail.model || productStock.model,
      color: productStock.color || productStock.colorName,
      priceIncAmt: '' + trade.normalPrice,
      priceDiscountAmt: '' + trade.discount.amount,
      grandTotalAmt: '',
      userId: this.user.username,
      cusNameOrder: `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || '-',
      preBookingNo: preBooking ? preBooking.preBookingNo : '',
      depositAmt: preBooking ? preBooking.depositAmt : '',
      reserveNo: preBooking ? preBooking.reserveNo : '',
      subStockDestination: subStock
    };
  }
}
