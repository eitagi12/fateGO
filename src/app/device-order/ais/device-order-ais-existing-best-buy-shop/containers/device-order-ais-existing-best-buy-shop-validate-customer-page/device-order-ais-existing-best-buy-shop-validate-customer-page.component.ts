import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Transaction, TransactionAction, Customer, MainPromotion, Order, TransactionType, Prebooking } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { User, HomeService, Utils, AlertService, PageLoadingService, TokenService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { LocalStorageService } from 'ngx-store';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { CustomerInfoService } from 'src/app/device-order/services/customer-info.service';
import { PrivilegeService } from 'src/app/device-order/services/privilege.service';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_VALIDATE_CUSTOMER_ID_CARD_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_MOBILE_DETAIL_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_CUSTOMER_INFO_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_ELIGIBLE_MOBILE_PAGE } from '../../constants/route-path.constant';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { CheckChangeServiceService } from 'src/app/device-order/services/check-change-service.service';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-shop-validate-customer-page',
  templateUrl: './device-order-ais-existing-best-buy-shop-validate-customer-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-shop-validate-customer-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyShopValidateCustomerPageComponent implements OnInit, OnDestroy {

  wizards: any = WIZARD_DEVICE_ORDER_AIS;
  readonly PLACEHOLDER: string = '(หมายเลขโทรศัพท์ / เลขบัตรประชาชน)';
  readonly PLACEHOLDER_HEADDER: string = 'กรอกเอกสารแสดงตน';

  transaction: Transaction;
  priceOption: PriceOption;
  user: User;
  identityValid: boolean = false;
  identity: string;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private utils: Utils,
    private http: HttpClient,
    private alertService: AlertService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private localStorageService: LocalStorageService,
    private priceOptionService: PriceOptionService,
    private customerInfoService: CustomerInfoService,
    private privilegeService: PrivilegeService,
    private tokenService: TokenService,
    private sharedTransactionService: SharedTransactionService,
    private checkChangeService: CheckChangeServiceService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.user = this.tokenService.getUser();
    this.homeService.callback = () => {
      this.alertService.question('ต้องการยกเลิกรายการขายหรือไม่ การยกเลิก ระบบจะคืนสินค้าเข้าสต๊อคสาขาทันที', 'ตกลง', 'ยกเลิก')
        .then((response: any) => {
          if (response.value === true) {
            this.returnStock().then(() => {
              window.location.href = '/';
            });
          }
        });
    };
  }

  ngOnInit(): void {
    this.createTransaction();
  }

  onError(valid: boolean): void {
    this.identityValid = valid;
  }

  onCompleted(identity: string): void {
    this.identity = identity;
  }

  onReadCard(): void {
    this.transaction.data.action = TransactionAction.READ_CARD;
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_VALIDATE_CUSTOMER_ID_CARD_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): void {
    const queryParams = this.priceOption.queryParams;
    if (this.transaction && this.transaction.data && this.transaction.data.order && this.transaction.data.order.soId) {
      this.alertService.question('ต้องการยกเลิกรายการขายหรือไม่ การยกเลิก ระบบจะคืนสินค้าเข้าสต๊อคสาขาทันที', 'ตกลง', 'ยกเลิก')
        .then((response: any) => {
          if (response.value === true) {
            this.returnStock().then(() => {
              this.transactionService.remove();
              window.location.href = `/sales-portal/buy-product/brand/${queryParams.brand}/${queryParams.model}`;
            });
          }
        });
    } else {
      this.transactionService.remove();
      window.location.href = `/sales-portal/buy-product/brand/${queryParams.brand}/${queryParams.model}`;
    }
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    if (this.utils.isMobileNo(this.identity)) {
      // KEY-IN MobileNo

      this.customerInfoService.getCustomerProfileByMobileNo(this.identity).then((customer: Customer) => {
        return this.privilegeService.checkAndGetPrivilegeCode(this.identity, this.priceOption.trade.ussdCode).then((privligeCode) => {
          customer.privilegeCode = privligeCode;
          this.transaction.data.customer = customer;
          this.transaction.data.customer.repi = true;
          this.transaction.data.simCard = { mobileNo: this.identity };
          this.transaction.data.action = TransactionAction.KEY_IN_REPI;
          if (!this.transaction.data.order || !this.transaction.data.order.soId) {
            return this.http.post(
              '/api/salesportal/dt/add-cart-list',
              this.getRequestAddDeviceSellingCart()
            ).toPromise()
              .then((resp: any) => {
                this.transaction.data.order = { soId: resp.data.soId };
                return this.sharedTransactionService.createSharedTransaction(this.transaction, this.priceOption);
              }).then(() => {
                this.checkKnoxGuard();
              });
          } else {
            this.checkKnoxGuard();
            return;
          }
        }).catch((e) => this.alertService.error(e));
      }).catch((error) => this.alertService.error(error));
    } else {
      // KEY-IN ID-Card
      this.customerInfoService.getCustomerInfoByIdCard(this.identity).then((customer: Customer) => {
        this.transaction.data.customer = customer;
        this.transaction.data.billingInformation = {};
        this.transaction.data.billingInformation.billDeliveryAddress = this.transaction.data.customer;
        if (!this.transaction.data.order || !this.transaction.data.order.soId) {
          return this.http.post(
            '/api/salesportal/dt/add-cart-list',
            this.getRequestAddDeviceSellingCart()
          ).toPromise()
            .then((resp: any) => {
              this.transaction.data.order = { soId: resp.data.soId };
              return this.sharedTransactionService.createSharedTransaction(this.transaction, this.priceOption);
            }).then(() => {
              this.transaction.data.action = TransactionAction.KEY_IN;
              if (this.transaction.data.customer.caNumber) {
                this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_CUSTOMER_INFO_PAGE]);
              } else {
                this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_ELIGIBLE_MOBILE_PAGE]);
              }
            });
        } else {
          this.pageLoadingService.closeLoading();
          if (this.transaction.data.customer.caNumber) {
            this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_CUSTOMER_INFO_PAGE]);
          } else {
            this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_ELIGIBLE_MOBILE_PAGE]);
          }
        }
      }).then(() => this.pageLoadingService.closeLoading());
    }
  }

  ngOnDestroy(): void {
    if (this.transaction.data.order && this.transaction.data.order.soId) {
      this.transactionService.update(this.transaction);
    } else {
      this.transactionService.save(this.transaction);
    }
  }

  private createTransaction(): void {
    const mainPromotion: MainPromotion = {
      campaign: this.priceOption.campaign,
      privilege: this.priceOption.privilege,
      trade: this.priceOption.trade
    };

    const preBooking = this.localStorageService.load('preBooking').value;
    //  Ex data Prebooking

    // const preBooking: Prebooking = {
    //   preBookingNo: 'PB100000000000000',
    //   depositAmt: '2000',
    //   deliveryDt: '17/03/2019'
    // };

    let order: Order;
    let transactionId: string;
    if (this.transaction.data && this.transaction.data.order && this.transaction.data.order.soId) {
      transactionId = this.transaction.transactionId;
      order = this.transaction.data.order;
    }

    this.transaction = {
      transactionId: transactionId,
      data: {
        transactionType: TransactionType.DEVICE_ORDER_EXISTING_AIS,
        action: TransactionAction.KEY_IN,
        preBooking: preBooking,
        order: order
      }
    };
  }

  customerValidate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const length: number = control.value.length;

    if (length >= 10) {
      if (length === 10) {
        if (this.utils.isMobileNo(value)) {
          return null;
        } else {
          return {
            message: 'กรุณากรอกหมายเลขโทรศัพท์ให้ถูกต้อง',
          };
        }
      } else if (length === 13) {
        if (this.utils.isThaiIdCard(value)) {
          return null;
        } else {
          return {
            message: 'กรุณากรอกเลขบัตรประชาชนให้ถูกต้อง',
          };
        }
      } else {
        return {
          message: 'กรุณากรอกรูปแบบให้ถูกต้อง',
        };
      }
    } else {
      return {
        message: 'กรุณากรอกรูปแบบให้ถูกต้อง',
      };
    }
  }

  returnStock(): Promise<void> {
    return new Promise(resolve => {
      const transaction = this.transactionService.load();

      const promiseAll = [];
      if (transaction.data) {
        if (transaction.data.order && transaction.data.order.soId) {
          const order = this.http.post('/api/salesportal/dt/remove-cart', {
            soId: transaction.data.order.soId,
            userId: this.user.username
          }).toPromise().catch(() => Promise.resolve());
          promiseAll.push(order);
        }
      }
      Promise.all(promiseAll).then(() => resolve());
    });
  }

  getRequestAddDeviceSellingCart(): any {
    const productStock = this.priceOption.productStock;
    const productDetail = this.priceOption.productDetail;
    const trade = this.priceOption.trade;
    const customer = this.transaction.data.customer;
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

  checkKnoxGuard(): void {
    const isKnoxGuard: boolean = this.priceOption.trade && this.priceOption.trade.serviceLockHs;
    if (isKnoxGuard) {
      this.checkChangeService.CheckServiceKnoxGuard(this.identity).then(() => {
        this.pageLoadingService.closeLoading();
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_MOBILE_DETAIL_PAGE]);
      }).catch((resp) => {
        this.alertService.error(resp);
      });
    } else {
      this.pageLoadingService.closeLoading();
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_MOBILE_DETAIL_PAGE]);
    }
  }
}
