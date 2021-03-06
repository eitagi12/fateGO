import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Transaction, Customer, Prebooking } from 'src/app/shared/models/transaction.model';
import { ReadCardProfile, User, ValidateCustomerIdCardComponent, HomeService, PageLoadingService, AlertService, TokenService } from 'mychannel-shared-libs';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { CustomerInfoService } from 'src/app/device-order/services/customer-info.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_CUSTOMER_INFO_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_VALIDATE_CUSTOMER_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-shop-validate-customer-id-card-page',
  templateUrl: './device-order-ais-existing-best-buy-shop-validate-customer-id-card-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-shop-validate-customer-id-card-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyShopValidateCustomerIdCardPageComponent implements OnInit, OnDestroy {

  kioskApi: boolean;

  transaction: Transaction;
  profile: ReadCardProfile;
  zipcode: string;
  readCardValid: boolean;
  priceOption: PriceOption;
  user: User;
  billDeliveryAddress: Customer;
  progressReadCard: number;

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

  onProgress(progress: number): void {
    this.progressReadCard = progress;
  }

  progressDoing(): boolean {
    return this.progressReadCard > 0 && this.progressReadCard < 100 ? true : false;
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
            this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_CUSTOMER_INFO_PAGE]);
            return;
          }
          return this.http.post(
            '/api/salesportal/dt/add-cart-list',
            this.getRequestAddDeviceSellingCart()
          ).toPromise().then((resp: any) => {
            this.transaction.data.order = { soId: resp.data.soId };
            return this.sharedTransactionService.createSharedTransaction(this.transaction, this.priceOption);
          }).then(() => {
            this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_CUSTOMER_INFO_PAGE]);
          });
        });
    }).catch((e) => this.alertService.error(e))
      .then(() => this.pageLoadingService.closeLoading());
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_VALIDATE_CUSTOMER_PAGE]);
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
    } else {
      subStock = 'BRN';
    }

    const product = {
      productType: productDetail.productType || 'DEVICE',
      soCompany: productStock.company || 'AWN',
      productSubType: productDetail.productSubType || 'HANDSET',
      brand: productDetail.brand || productStock.brand,
      model: productDetail.model || productStock.model,
      qty: '1',

      color: productStock.color || productStock.colorName,
      matCode: '',
      priceIncAmt: '' + trade.normalPrice,
      priceDiscountAmt: '' + trade.discount.amount,
      matAirTime: '',
      listMatFreeGoods: [{
        matCodeFG: '',
        qtyFG: '' // จำนวนของแถม *กรณีส่งค่า matCodeFreeGoods ค่า qty จะต้องมี
      }]
    };

    return {
      locationSource: this.user.locationCode,
      locationReceipt: this.user.locationCode,
      userId: this.user.username,
      cusNameOrder: `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || '-',
      soChannelType: 'MC_KIOSK',
      soDocumentType: 'RESERVED',
      productList: [product],

      grandTotalAmt: '',
      preBookingNo: preBooking ? preBooking.preBookingNo : '',
      depositAmt: preBooking ? preBooking.depositAmt : '',
      reserveNo: preBooking ? preBooking.reserveNo : '',
      subStockDestination: subStock,
      storeName: ''
    };
  }

}
