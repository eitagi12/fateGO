import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { ApiRequestService, PageLoadingService, HomeService, Utils, AlertService } from 'mychannel-shared-libs';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { ROUTE_BUY_PRODUCT_CAMPAIGN_PAGE } from 'src/app/buy-product/constants/route-path.constant';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_VALIDATE_CUSTOMER_ID_CARD_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CUSTOMER_INFO_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_ELIGIBLE_MOBILE_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_DETAIL_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/constants/route-path.constant';
import { Transaction, TransactionType, TransactionAction, BillDeliveryAddress, Customer, MainPromotion, ProductStock, Prebooking } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { LocalStorageService } from 'ngx-store';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { CreateDeviceOrderBestBuyService } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/services/create-device-order-best-buy.service';
import { CustomerInfoService } from '../../services/customer-info.service';
import { PrivilegeService } from '../../services/privilege.service';

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
  identityValid: boolean = false;
  identity: string;
  priceOption: PriceOption;
  billDeliveryAddress: BillDeliveryAddress;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private utils: Utils,
    private alertService: AlertService,
    private apiRequestService: ApiRequestService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private localStorageService: LocalStorageService,
    private priceOptionService: PriceOptionService,
    private customerInfoService: CustomerInfoService,
    private privilegeService: PrivilegeService,
    private createDeviceOrderBestBuyService: CreateDeviceOrderBestBuyService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.homeService.callback = () => {
      this.alertService.question('ต้องการยกเลิกรายการขายหรือไม่ การยกเลิก ระบบจะคืนสินค้าเข้าสต๊อคสาขาทันที', 'ตกลง', 'ยกเลิก')
        .then((response: any) => {
          if (response.value === true) {
           this.createDeviceOrderBestBuyService.cancelOrderAndRedirect(this.transaction, '/').then((url: string) => {
              window.location.href = url;
           });
          }
        });
    };
  }

  ngOnInit(): void {
    if (!this.transaction || !this.transaction.data) {
      this.createTransaction();
    }
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
            const productDetail = this.priceOption.productDetail;
            this.createDeviceOrderBestBuyService.cancelOrderAndRedirect(this.transaction
                , `/sales-portal/buy-product/brand/${productDetail.brand}/${productDetail.model}`)
                .then((url: string) => {
                  window.location.href = url;
             });
          }
        });
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
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
    } else {
      // KEY-IN ID-Card
      this.customerInfoService.getCustomerInfoByIdCard(this.identity).then((customer: Customer) => {
        this.transaction.data.customer = customer;
        this.transaction.data.billingInformation = {};
        this.transaction.data.billingInformation.billDeliveryAddress = customer;
        this.createDeviceOrderBestBuyService.createAddToCartTrasaction(this.transaction, this.priceOption)
          .then((transaction) => {
            this.transaction = transaction;
            this.pageLoadingService.closeLoading();
            if (this.transaction.data.customer.caNumber) {
              this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CUSTOMER_INFO_PAGE]);
            } else {
              this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_ELIGIBLE_MOBILE_PAGE]);
            }
        });
      });
    }
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
    this.priceOptionService.save(this.priceOption);
  }

  private createTransaction(): void {
    // New x-api-request-id
    // this.apiRequestService.createRequestId();

    const mainPromotion = this.setMainPromotion();

    if (!this.priceOption.campaign) {
      this.createPriceOption(mainPromotion);
    }

    const preBooking = this.localStorageService.load('preBooking').value;
    // const preBooking: Prebooking = {
    //   preBookingNo: 'PB100000000000000',
    //   depositAmt: '2000',
    //   deliveryDt: '17/03/2019'
    // };

    this.transaction = {
      transactionId: this.createDeviceOrderBestBuyService.generateTransactionId(this.apiRequestService.getCurrentRequestId()),
      data: {
        transactionType: TransactionType.DEVICE_ORDER_EXISTING_AIS,
        action: TransactionAction.KEY_IN,
        mainPromotion: mainPromotion,
        preBooking: preBooking,
        advancePayment: mainPromotion.trade.advancePay
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

  setMainPromotion(): MainPromotion {
    const campaign = this.priceOption.campaign ? this.priceOption.campaign : this.localStorageService.load('priceOption').value;
    const privilege = this.localStorageService.load('priceOptionPrivilege').value;
    const trade = this.localStorageService.load('priceOptionPrivilegeTrade').value;

    const mainPromotion: MainPromotion = {
      campaign: campaign,
      privilege: privilege,
      trade: trade
    };
    return mainPromotion;
  }

  createPriceOption(mainPromotion: MainPromotion): void {
    const productDetail: any = this.localStorageService.load('productDetail').value;
    const productInfo: any = this.localStorageService.load('productInfo').value;
    this.priceOption = {
      campaign: mainPromotion.campaign,
      trade: mainPromotion.trade,
      productDetail: productDetail,
      productStock: productInfo
    };
  }
}
