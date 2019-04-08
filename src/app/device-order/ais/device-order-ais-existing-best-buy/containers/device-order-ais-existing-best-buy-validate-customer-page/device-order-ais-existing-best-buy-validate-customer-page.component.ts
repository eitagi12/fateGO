import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { ApiRequestService, PageLoadingService, HomeService, Utils, AlertService, User, TokenService } from 'mychannel-shared-libs';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_VALIDATE_CUSTOMER_ID_CARD_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CUSTOMER_INFO_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_ELIGIBLE_MOBILE_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_DETAIL_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/constants/route-path.constant';
import { Transaction, TransactionType, TransactionAction, BillDeliveryAddress, Customer, MainPromotion, Prebooking } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { LocalStorageService } from 'ngx-store';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { CustomerInfoService } from '../../services/customer-info.service';
import { PrivilegeService } from '../../services/privilege.service';
import { HttpClient } from '@angular/common/http';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-validate-customer-page',
  templateUrl: './device-order-ais-existing-best-buy-validate-customer-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-validate-customer-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyValidateCustomerPageComponent implements OnInit, OnDestroy {

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
    private apiRequestService: ApiRequestService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private localStorageService: LocalStorageService,
    private priceOptionService: PriceOptionService,
    private customerInfoService: CustomerInfoService,
    private privilegeService: PrivilegeService,
    private tokenService: TokenService,
    private sharedTransactionService: SharedTransactionService
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
  }

  onError(valid: boolean): void {
    this.identityValid = valid;
  }

  onCompleted(identity: string): void {
    this.identity = identity;
  }

  onReadCard(): void {
    this.transaction.data.action = TransactionAction.READ_CARD;
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_VALIDATE_CUSTOMER_ID_CARD_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): void {
    this.alertService.question('ต้องการยกเลิกรายการขายหรือไม่ การยกเลิก ระบบจะคืนสินค้าเข้าสต๊อคสาขาทันที', 'ตกลง', 'ยกเลิก')
      .then((response: any) => {
        if (response.value === true) {
          const queryParams = this.priceOption.queryParams;
          this.returnStock().then(() => {
            window.location.href = `/sales-portal/buy-product/brand/${queryParams.brand}/${queryParams.model}`;
          });
        }
      });
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    this.createTransaction();
    if (this.utils.isMobileNo(this.identity)) {
      // KEY-IN MobileNo
      this.privilegeService.checkAndGetPrivilegeCode(this.identity, this.priceOption.trade.ussdCode).then((privligeCode) => {
        this.customerInfoService.getCustomerProfileByMobileNo(this.identity).then((customer: Customer) => {
          customer.privilegeCode = privligeCode;
          this.transaction.data.customer = customer;
          this.transaction.data.customer.repi = true;
          this.transaction.data.simCard = { mobileNo: this.identity };
          this.transaction.data.action = TransactionAction.KEY_IN_REPI;
          this.pageLoadingService.closeLoading();
          this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_DETAIL_PAGE]);
        });
      });
      return;
    } else {
      // KEY-IN ID-Card
      this.customerInfoService.getCustomerInfoByIdCard(this.identity).then((customer: Customer) => {
        this.transaction.data.customer = customer;
        this.transaction.data.billingInformation = {};
        this.transaction.data.billingInformation.billDeliveryAddress = {
          homeNo: customer.homeNo,
          moo: customer.moo,
          mooBan: customer.mooBan,
          room: customer.room,
          floor: customer.floor,
          buildingName: customer.buildingName,
          soi: customer.soi,
          street: customer.street,
          province: customer.province,
          amphur: customer.amphur,
          tumbol: customer.tumbol,
          zipCode: customer.zipCode
        };
        return this.http.post('/api/salesportal/add-device-selling-cart',
          this.getRequestAddDeviceSellingCart()
        ).toPromise()
          .then((resp: any) => {
            this.transaction.data.order = { soId: resp.data.soId };
            return this.sharedTransactionService.createSharedTransaction(this.transaction, this.priceOption);
          }).then(() => {
            if (this.transaction.data.customer.caNumber) {
              this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CUSTOMER_INFO_PAGE]);
            } else {
              this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_ELIGIBLE_MOBILE_PAGE]);
            }
          });
        // this.createDeviceOrderBestBuyService.createAddToCartTrasaction(this.transaction, this.priceOption)
        //   .then((transaction) => {
        //     this.transaction = transaction;
        //     this.pageLoadingService.closeLoading();
        //     if (this.transaction.data.customer.caNumber) {
        //       this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CUSTOMER_INFO_PAGE]);
        //     } else {
        //       this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_ELIGIBLE_MOBILE_PAGE]);
        //     }
        //   }).catch((e) => {
        //     this.pageLoadingService.closeLoading();
        //     this.alertService.error(e);
        //   });
      }).then(() => this.pageLoadingService.closeLoading());
    }
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
    // this.priceOptionService.save(this.priceOption);
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

    this.transaction = {
      data: {
        transactionType: TransactionType.DEVICE_ORDER_EXISTING_AIS,
        action: TransactionAction.KEY_IN,
        preBooking: preBooking
      }
    };
  }

  customerValidate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const length = control.value.length;

    if (length === 10) {
      if (this.utils.isMobileNo(value)) {
        return null;
      } else {
        return {
          message: 'กรุณากรอกหมายเลขโทรศัพท์ให้ถูกต้อง',
        };
      }
    }

    if (length === 13) {
      if (this.utils.isThaiIdCard(value)) {
        return null;
      } else {
        return {
          message: 'กรุณากรอกเลขบัตรประชาชนให้ถูกต้อง',
        };
      }
    }
  }

  returnStock(): Promise<void> {
    return new Promise(resolve => {
      const transaction = this.transactionService.load();

      const promiseAll = [];
      if (transaction.data) {
        if (transaction.data.order && transaction.data.order.soId) {
          const order = this.http.post('/api/salesportal/device-sell/item/clear-temp-stock', {
            location: this.priceOption.productStock.location,
            soId: transaction.data.order.soId,
            transactionId: transaction.transactionId
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
    const customer = this.transaction.data.customer;
    const preBooking: Prebooking = this.transaction.data.preBooking;
    return {
      soCompany: productStock.company || 'AWN',
      locationSource: this.user.locationCode,
      locationReceipt: this.user.locationCode,
      productType: productDetail.productType || 'DEVICE',
      productSubType: productDetail.productSubType || 'HANDSET',
      brand: productDetail.brand,
      model: productDetail.model,
      color: productStock.color,
      priceIncAmt: '',
      priceDiscountAmt: '',
      grandTotalAmt: '',
      userId: this.user.username,
      cusNameOrder: `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || '-',
      preBookingNo: preBooking ? preBooking.preBookingNo : '',
      depositAmt: preBooking ? preBooking.depositAmt : '',
      reserveNo: preBooking ? preBooking.reserveNo : ''
    };
  }
}
