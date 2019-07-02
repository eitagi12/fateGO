import { Component, OnInit, OnDestroy } from '@angular/core';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { TokenService, User, HomeService, AlertService, Utils, PageLoadingService } from 'mychannel-shared-libs';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Transaction, TransactionAction, Customer, Order, TransactionType } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ROUTE_DEVICE_ORDER_AIS_GADGET_VALIDATE_CUSTOMER_ID_CARD_PAGE, ROUTE_DEVICE_ORDER_AIS_GADGET_CUSTOMER_INFO_PAGE, ROUTE_DEVICE_ORDER_AIS_GADGET_VALIDATE_IDENTIFY_PAGE, ROUTE_DEVICE_ORDER_AIS_GADGET_ELIGIBLE_MOBILE_PAGE, ROUTE_DEVICE_ORDER_AIS_GADGET_MOBILE_DETAIL_PAGE } from '../../constants/route-path.constant';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { CustomerInfoService } from 'src/app/device-order/services/customer-info.service';
import { PrivilegeService } from 'src/app/device-order/services/privilege.service';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';
import { ProfileFbbService } from 'src/app/shared/services/profile-fbb.service';
import { ProfileFbb } from 'src/app/shared/models/profile-fbb.model';

@Component({
  selector: 'app-device-order-ais-existing-gadget-validate-customer-page',
  templateUrl: './device-order-ais-existing-gadget-validate-customer-page.component.html',
  styleUrls: ['./device-order-ais-existing-gadget-validate-customer-page.component.scss']
})
export class DeviceOrderAisExistingGadgetValidateCustomerPageComponent implements OnInit, OnDestroy {

  wizards: any = WIZARD_DEVICE_ORDER_AIS;
  readonly PLACEHOLDER: string = '(หมายเลขโทรศัพท์ / เลขบัตรประชาชน)';
  readonly PLACEHOLDER_HEADDER: string = 'กรอกเอกสารแสดงตน';

  transaction: Transaction;
  priceOption: PriceOption;
  profileFbb: ProfileFbb;
  user: User;
  identityValid: boolean = false;
  identity: string;
  isFbbNo: boolean;

  constructor(
    private router: Router,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private tokenService: TokenService,
    private homeService: HomeService,
    private alertService: AlertService,
    private http: HttpClient,
    private utils: Utils,
    private pageLoadingService: PageLoadingService,
    private customerInfoService: CustomerInfoService,
    private privilegeService: PrivilegeService,
    private sharedTransactionService: SharedTransactionService,
    private profileFbbService: ProfileFbbService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.profileFbb = this.profileFbbService.load();
    this.profileFbbService.remove();
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

  private createTransaction(): void {
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
        order: order
      }
    };
  }

  onReadCard(): void {
    this.transaction.data.action = TransactionAction.READ_CARD;
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_GADGET_VALIDATE_CUSTOMER_ID_CARD_PAGE]);
  }

  onCompleted(identity: string): void {
    this.identity = identity;
  }

  onError(valid: boolean): void {
    this.identityValid = valid;
  }

  checkFbbNo(identity: string): boolean {
    const REGEX_FBB_MOBILE = /^88[0-9]\d{7}$/;
    return REGEX_FBB_MOBILE.test(identity);
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    if (this.checkFbbNo(this.identity)) {
      // KEY-IN FbbNo
      const body = {
        option: '3',
        mobileNo: this.identity
      };
      this.customerInfoService.queryFbbInfo(body).then((response: any) => {
        this.profileFbb = response;
        const fullName = (this.profileFbb.billingProfiles[0].caName || '').split(' ');
        this.transaction.data.action = TransactionAction.KEY_IN_FBB;
        return this.privilegeService.checkAndGetPrivilegeCode(this.identity, '*999*04#').then((privilegeCode) => {
          this.transaction = {
            ...this.transaction,
            data: {
              ...this.transaction.data,
              customer: {
                ...this.transaction.data.customer,
                privilegeCode: privilegeCode,
                titleName: 'คุณ',
                firstName: fullName[0],
                lastName: fullName[1],
                caNumber: this.profileFbb.billingProfiles[0].caNo
              },
              simCard: {
                ...this.transaction.data.simCard,
                mobileNo: this.identity
              }
            }
          };
          this.checkRoutePath();
        }).catch((e) => {
          this.pageLoadingService.closeLoading();
          this.alertService.error(e);
        });
      }).catch((error: any) => {
        this.pageLoadingService.closeLoading();
        this.alertService.error(error);
      });
    } else if (this.utils.isMobileNo(this.identity)) {
      // KEY-IN MobileNo
      this.customerInfoService.getCustomerProfileByMobileNo(this.identity).then((customer: Customer) => {
        this.transaction.data.simCard = { mobileNo: this.identity };
        this.transaction.data.action = TransactionAction.KEY_IN_MOBILE_NO;
      }).then(() => {
        this.checkRoutePath();
      });
    } else {
      // KEY-IN ID-Card
      this.customerInfoService.getCustomerInfoByIdCard(this.identity).then((customer: Customer) => {
        this.transaction.data.customer = customer;
        this.transaction.data.billingInformation = {};
        this.transaction.data.billingInformation.billDeliveryAddress = this.transaction.data.customer;
        if (!this.transaction.data.order || !this.transaction.data.order.soId) {
          return this.http.post('/api/salesportal/add-device-selling-cart',
            this.getRequestAddDeviceSellingCart()
          ).toPromise()
            .then((resp: any) => {
              this.transaction.data.order = { soId: resp.data.soId };
              return this.sharedTransactionService.createSharedTransaction(this.transaction, this.priceOption);
            }).then(() => {
              this.transaction.data.action = TransactionAction.KEY_IN;
              this.checkRoutePath();
            });
        } else {
          this.checkRoutePath();
        }
      }).then(() => this.pageLoadingService.closeLoading());
    }
  }

  private checkRoutePath(): void {
    this.pageLoadingService.closeLoading();
    if (this.checkFbbNo(this.identity)) {
      // KEY-IN FbbNo
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_GADGET_MOBILE_DETAIL_PAGE]);
    } else if (this.utils.isMobileNo(this.identity)) {
      // KEY-IN MobileNo
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_GADGET_VALIDATE_IDENTIFY_PAGE]);
    } else {
      // KEY IN IDCARD
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_GADGET_CUSTOMER_INFO_PAGE]);
    }
  }

  getRequestAddDeviceSellingCart(): any {
    const productStock = this.priceOption.productStock;
    const productDetail = this.priceOption.productDetail;
    const trade = this.priceOption.trade;
    const customer = this.transaction.data.customer;

    return {
      soCompany: productStock.company || 'AWN',
      locationSource: this.user.locationCode,
      locationReceipt: this.user.locationCode,
      productType: productDetail.productType || ' -*',
      productSubType: productDetail.productSubType || 'N/A',
      brand: productDetail.brand || productStock.brand,
      model: productDetail.model || productStock.model,
      color: productStock.color || productStock.colorName,
      priceIncAmt: '' + trade.normalPrice,
      priceDiscountAmt: '' + trade.discount.amount,
      grandTotalAmt: '',
      userId: this.user.username,
      cusNameOrder: `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || '-',
    };
  }

  customerValidate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const length: number = control.value.length;
    const REGEX_FBB_MOBILE = /^88[0-9]\d{7}$/;
    const isFbbNo = REGEX_FBB_MOBILE.test(value);
    if (length >= 10) {
      if (length === 10) {
        if (this.utils.isMobileNo(value) || isFbbNo) {
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
              window.location.href = `/ales-portal/buy-product/brand/${queryParams.brand}/${queryParams.model}`;
            });
          }
        });
    } else {
      this.transactionService.remove();
      window.location.href = `/sales-portal/buy-product/brand/${queryParams.brand}/${queryParams.model}`;
    }
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
    this.profileFbbService.save(this.profileFbb);
  }
}
