import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { ReadCardProfile, ValidateCustomerIdCardComponent, Utils, HomeService, AlertService, TokenService, PageLoadingService, User, ReadCard, ReadCardEvent, ReadCardService } from 'mychannel-shared-libs';
import { Transaction, TransactionAction, Customer, Prebooking } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { ROUTE_DEVICE_ORDER_ASP_BEST_BUY_VALIDATE_CUSTOMER_REPI_PAGE, ROUTE_DEVICE_ORDER_ASP_BEST_BUY_PAYMENT_DETAIL_PAGE, ROUTE_DEVICE_ORDER_ASP_BEST_BUY_CUSTOMER_PROFILE_PAGE } from '../../constants/route-path.constant';
import { CustomerInfoService } from '../../services/customer-info.service';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-device-order-asp-existing-best-buy-validate-customer-id-card-repi-page',
  templateUrl: './device-order-asp-existing-best-buy-validate-customer-id-card-repi-page.component.html',
  styleUrls: ['./device-order-asp-existing-best-buy-validate-customer-id-card-repi-page.component.scss']
})
export class DeviceOrderAspExistingBestBuyValidateCustomerIdCardRepiPageComponent implements OnInit, OnDestroy {

  kioskApi: boolean;
  isTelewiz: boolean = this.tokenService.isTelewizUser();
  transaction: Transaction;
  profile: ReadCardProfile;
  zipcode: string;
  readCardValid: boolean;
  mobileNo: string;
  priceOption: PriceOption;
  user: User;

  readCard: ReadCard;
  readCardSubscription: Subscription;

  showProgress: boolean;
  progress: number;
  error: any;

  @ViewChild(ValidateCustomerIdCardComponent)
  validateCustomerIdcard: ValidateCustomerIdCardComponent;

  constructor(
    private router: Router,
    private utils: Utils,
    private http: HttpClient,
    private homeService: HomeService,
    private alertService: AlertService,
    private customerInfoService: CustomerInfoService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private pageLoadingService: PageLoadingService,
    private tokenService: TokenService,
    private readCardService: ReadCardService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.user = this.tokenService.getUser();
  }

  ngOnInit(): void {
    this.transaction.data.action = TransactionAction.READ_CARD_REPI;
    if (this.isTelewiz) {
      this.readCardflowPC();
    }
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

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_ASP_BEST_BUY_VALIDATE_CUSTOMER_REPI_PAGE]);
  }

  onNext(): void {
    const mobileNo = this.transaction.data.simCard.mobileNo;

    this.pageLoadingService.openLoading();

    this.customerInfoService.getProvinceId(this.profile.province).then((provinceId: string) => {
      return this.customerInfoService.getZipCode(provinceId, this.profile.amphur, this.profile.tumbol).then((zipCode: string) => {
        return this.customerInfoService.getCustomerInfoByIdCard(this.profile.idCardNo, zipCode).then((customer: Customer) => {
          this.transaction.data.customer = Object.assign(this.profile, customer);
          const addressCustomer = this.transaction.data.customer;
          this.transaction.data.billingInformation = {};
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
          // verify Prepaid Ident
          return this.customerInfoService.verifyPrepaidIdent(this.profile.idCardNo, mobileNo)
            .then((respPrepaidIdent: any) => {
              if (respPrepaidIdent) {
                console.log(this.profile);
                const expireDate = this.profile.expireDate;
                if (this.utils.isIdCardExpiredDate(expireDate)) {
                  this.pageLoadingService.closeLoading();
                  this.router.navigate([ROUTE_DEVICE_ORDER_ASP_BEST_BUY_PAYMENT_DETAIL_PAGE]);
                } else {
                  const idCardType = this.transaction.data.customer.idCardType;
                  this.alertService.error('ไม่สามารถทำรายการได้ เนื่องจาก' + idCardType + 'หมดอายุ');
                }
              } else {
                const expireDate = this.profile.expireDate;
                if (this.utils.isIdCardExpiredDate(expireDate)) {
                  const simCard = this.transaction.data.simCard;
                  if (simCard.chargeType === 'Pre-paid') {
                    this.pageLoadingService.closeLoading();
                    this.router.navigate([ROUTE_DEVICE_ORDER_ASP_BEST_BUY_CUSTOMER_PROFILE_PAGE]);
                    // this.createDeviceOrderBestBuyService.createAddToCartTrasaction(this.transaction, this.priceOption)
                    // .then((transaction) => {
                    //   this.transaction = transaction;
                    //   this.pageLoadingService.closeLoading();
                    //   this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CUSTOMER_PROFILE_PAGE]);
                    // });
                  } else {
                    this.alertService.error('ไม่สามารถทำรายการได้ เบอร์รายเดือน ข้อมูลการแสดงตนไม่ถูกต้อง');
                  }
                } else {
                  const idCardType = this.transaction.data.customer.idCardType;
                  this.alertService.error('ไม่สามารถทำรายการได้ เนื่องจากบัตรประชาชนหมดอายุ');
                }
              }
            });
        });
      });
    });
    // .catch((resp: any) => {
    //   const error = resp.error || [];
    //   console.log(resp);

    //   if (error && error.errors.length > 0) {
    //     this.alertService.notify({
    //       type: 'error',
    //       html: error.errors.map((err) => {
    //         return '<li class="text-left">' + err + '</li>';
    //       }).join('')
    //     }).then(() => {
    //       this.onBack();
    //     });
    //   } else {
    //     this.alertService.error(error.resultDescription);
    //   }
    // }).then(() => this.pageLoadingService.closeLoading());
  }

  onHome(): void {
    this.homeService.goToHome();
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

  readCardflowPC(): void {
    this.readCardSubscription = this.readCardService.onReadCard().subscribe((readCard: ReadCard) => {
      this.readCard = readCard;

      this.progress = readCard.progress;
      const valid = !!(readCard.progress >= 100 && readCard.profile);
      if (readCard.error) {
        this.showProgress = false;
        this.profile = null;
      }

      if (readCard.eventName === ReadCardEvent.EVENT_CARD_LOAD_ERROR) {
        this.error = valid;
      }

      if (valid) {
        this.showProgress = true;
        this.profile = readCard.profile;

        if (!this.kioskApi) {
          this.profile = readCard.profile;
        }
      }

    });
  }
}
