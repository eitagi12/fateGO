import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { HomeService, PageLoadingService, AlertService, User, TokenService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Transaction, BillDeliveryAddress, Customer, TransactionAction, Prebooking } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_DETAIL_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_PAYMENT_DETAIL_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CUSTOMER_INFO_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CUSTOMER_PROFILE_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_VALIDATE_CUSTOMER_ID_CARD_RPI_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/constants/route-path.constant';
import { CustomerInfoService } from '../../services/customer-info.service';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-validate-customer-repi-page',
  templateUrl: './device-order-ais-existing-best-buy-validate-customer-repi-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-validate-customer-repi-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyValidateCustomerRepiPageComponent implements OnInit, OnDestroy {

  wizards: any = WIZARD_DEVICE_ORDER_AIS;
  readonly PLACEHOLDER: string = '(เลขบัตรประชาชน)';
  readonly PLACEHOLDER_HEADDER: string = 'กรอกเอกสารแสดงตน';

  transaction: Transaction;
  identityValid: boolean = false;
  identity: string;
  band: string;
  model: string;
  priceOption: PriceOption;
  user: User;

  constructor(
    private router: Router,
    private http: HttpClient,
    private homeService: HomeService,
    private alertService: AlertService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private customerInfoService: CustomerInfoService,
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
    this.identityValid = valid;
  }

  onCompleted(identity: string): void {
    this.identity = identity;
  }

  onReadCard(): void {
    this.transaction.data.action = TransactionAction.READ_CARD_REPI;
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_VALIDATE_CUSTOMER_ID_CARD_RPI_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_DETAIL_PAGE]);
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    const mobileNo = this.transaction.data.simCard.mobileNo;
    this.transaction.data.action = TransactionAction.KEY_IN_REPI;
    this.customerInfoService.verifyPrepaidIdent(this.identity, mobileNo).then((verifySuccess: boolean) => {
      if (verifySuccess) {
        this.customerInfoService.getCustomerInfoByIdCard(this.identity).then((customerInfo: any) => {
          if (customerInfo.firstName) {
            this.transaction.data.customer = { ...this.transaction.data.customer, ...customerInfo };
          } else {
            this.transaction.data.customer = customerInfo;
          }
          this.transaction.data.billingInformation = {};
          const addressCustomer = this.transaction.data.customer;
          this.transaction.data.billingInformation.billDeliveryAddress = {
            homeNo: addressCustomer.homeNo,
            moo: addressCustomer.moo,
            mooBan: addressCustomer.mooBan,
            room: addressCustomer.room,
            floor: addressCustomer.floor,
            buildingName: addressCustomer.buildingName,
            soi: addressCustomer.soi,
            street: addressCustomer.street,
            province: addressCustomer.province,
            amphur: addressCustomer.amphur,
            tumbol: addressCustomer.tumbol,
            zipCode: addressCustomer.zipCode
          };
          return this.http.post('/api/salesportal/add-device-selling-cart',
            this.getRequestAddDeviceSellingCart()
          ).toPromise()
            .then((resp: any) => {
              this.transaction.data.order = { soId: resp.data.soId };
              return this.sharedTransactionService.createSharedTransaction(this.transaction, this.priceOption);
            }).then(() => {
              this.transaction.data.action = TransactionAction.KEY_IN;
              this.pageLoadingService.closeLoading();
              this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CUSTOMER_INFO_PAGE]);
            });
          // this.createDeviceOrderBestBuyService.createAddToCartTrasaction(this.transaction, this.priceOption).then((transaction) => {
          //   this.transaction = transaction;
          //   this.transaction.data.action = TransactionAction.KEY_IN;
          //   this.pageLoadingService.closeLoading();
          //   this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CUSTOMER_INFO_PAGE]);
          // }).catch((e) => {
          //   this.pageLoadingService.closeLoading();
          //   this.alertService.error(e);
          // });
        });
      } else {
        const simCard = this.transaction.data.simCard;
        if (simCard.chargeType === 'Pre-paid') {
          this.customerInfoService.getCustomerInfoByIdCard(this.identity).then((customerInfo: any) => {
            if (customerInfo.firstName) {
              this.transaction.data.customer = { ...this.transaction.data.customer, ...customerInfo };
            } else {
              this.transaction.data.customer = customerInfo;
            }
            this.transaction.data.billingInformation = {};
            const addressCustomer = this.transaction.data.customer;
            this.transaction.data.billingInformation.billDeliveryAddress = {
              homeNo: addressCustomer.homeNo,
              moo: addressCustomer.moo,
              mooBan: addressCustomer.mooBan,
              room: addressCustomer.room,
              floor: addressCustomer.floor,
              buildingName: addressCustomer.buildingName,
              soi: addressCustomer.soi,
              street: addressCustomer.street,
              province: addressCustomer.province,
              amphur: addressCustomer.amphur,
              tumbol: addressCustomer.tumbol,
              zipCode: addressCustomer.zipCode
            };
            return this.http.post('/api/salesportal/add-device-selling-cart',
              this.getRequestAddDeviceSellingCart()
            ).toPromise()
              .then((resp: any) => {
                this.transaction.data.order = { soId: resp.data.soId };
                return this.sharedTransactionService.createSharedTransaction(this.transaction, this.priceOption);
              }).then(() => {
                this.transaction.data.action = TransactionAction.KEY_IN;
                this.pageLoadingService.closeLoading();
                this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CUSTOMER_INFO_PAGE]);
              });
            // this.transaction.data.billingInformation.billDeliveryAddress = this.transaction.data.customer;
            // this.createDeviceOrderBestBuyService.createAddToCartTrasaction(this.transaction, this.priceOption).then((transaction) => {
            //   this.transaction = transaction;
            //   this.transaction.data.action = TransactionAction.KEY_IN_REPI;
            //   this.pageLoadingService.closeLoading();
            //   this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CUSTOMER_PROFILE_PAGE]);
            // }).catch((e) => {
            //   this.pageLoadingService.closeLoading();
            //   this.alertService.error(e);
            // });
          });
        } else {
          // .then(() => this.pageLoadingService.closeLoading());
          this.pageLoadingService.closeLoading();
          this.alertService.error('ไม่สามารถทำรายการได้ เบอร์รายเดือน ข้อมูลการแสดงตนไม่ถูกต้อง');
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
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
