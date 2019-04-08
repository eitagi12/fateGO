import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { ApiRequestService, PageLoadingService, HomeService, Utils, AlertService, User, TokenService } from 'mychannel-shared-libs';
import { PriceOption } from 'src/app/shared/models/price-option.model';

import { Transaction, TransactionType, TransactionAction, BillDeliveryAddress, Customer, MainPromotion, Prebooking, Device } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { AbstractControl, ValidationErrors, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WIZARD_DEVICE_ORDER_AIS, WIZARD_DEVICE_ORDER_ASP } from 'src/app/device-order/constants/wizard.constant';
import { LocalStorageService } from 'ngx-store';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { ROUTE_DEVICE_ORDER_ASP_BEST_BUY_VALIDATE_CUSTOMER_ID_CARD_PAGE, ROUTE_DEVICE_ORDER_ASP_BEST_BUY_MOBILE_DETAIL_PAGE, ROUTE_DEVICE_ORDER_ASP_BEST_BUY_CUSTOMER_INFO_PAGE, ROUTE_DEVICE_ORDER_ASP_BEST_BUY_ELIGIBLE_MOBILE_PAGE } from '../../constants/route-path.constant';
import { CustomerInfoService } from '../../services/customer-info.service';
import { PrivilegeService } from '../../services/privilege.service';
import { HttpClient } from '@angular/common/http';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-device-order-asp-existing-best-buy-validate-customer-page',
  templateUrl: './device-order-asp-existing-best-buy-validate-customer-page.component.html',
  styleUrls: ['./device-order-asp-existing-best-buy-validate-customer-page.component.scss']
})
export class DeviceOrderAspExistingBestBuyValidateCustomerPageComponent implements OnInit, OnDestroy {

  wizards: any = this.tokenService.isTelewizUser() ? WIZARD_DEVICE_ORDER_ASP : WIZARD_DEVICE_ORDER_AIS;
  readonly PLACEHOLDER: string = '(หมายเลขโทรศัพท์ / เลขบัตรประชาชน)';
  readonly PLACEHOLDER_HEADDER: string = 'กรอกเอกสารแสดงตน';

  transaction: Transaction;
  identityValid: boolean = false;
  identity: string;
  priceOption: PriceOption;
  user: User;

  validateCustomerForm: FormGroup;

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
    private fb: FormBuilder
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
    if (this.tokenService.isTelewizUser()) {
      this.createForm();
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
    this.router.navigate([ROUTE_DEVICE_ORDER_ASP_BEST_BUY_VALIDATE_CUSTOMER_ID_CARD_PAGE]);
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
          this.router.navigate([ROUTE_DEVICE_ORDER_ASP_BEST_BUY_MOBILE_DETAIL_PAGE]);
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
              this.router.navigate([ROUTE_DEVICE_ORDER_ASP_BEST_BUY_CUSTOMER_INFO_PAGE]);
            } else {
              this.router.navigate([ROUTE_DEVICE_ORDER_ASP_BEST_BUY_ELIGIBLE_MOBILE_PAGE]);
            }
          });
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
    let device: Device;
    if (this.tokenService.isTelewizUser()) {
      device = this.localStorageService.load('device').value;
    }
    this.transaction = {
      data: {
        transactionType: TransactionType.DEVICE_ORDER_EXISTING_AIS,
        action: TransactionAction.KEY_IN,
        preBooking: preBooking,
        device: device
      }
    };
  }

  customerValidate(control: AbstractControl): ValidationErrors {
    const value = control.value;
    const length = control.value.length;

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

  createForm(): void {
    // nobileNo use pattern
    this.validateCustomerForm = this.fb.group({
      identity: ['', [Validators.required, this.customerValidate]],
    });

    this.validateCustomerForm.valueChanges.pipe(debounceTime(750))
      .subscribe((value: any) => {
        this.identityValid = this.validateCustomerForm.valid;
        if (this.validateCustomerForm.valid) {
          this.identity = value.identity;
        }
      });
  }
}
