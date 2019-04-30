import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { ReadCardProfile, ValidateCustomerIdCardComponent, Utils, HomeService, AlertService, TokenService, PageLoadingService, User } from 'mychannel-shared-libs';
import { Transaction, TransactionAction, Customer, Prebooking } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_VALIDATE_CUSTOMER_REPI_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CUSTOMER_PROFILE_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_PAYMENT_DETAIL_PAGE } from '../../constants/route-path.constant';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { CustomerInfoService } from 'src/app/device-order/services/customer-info.service';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-validate-customer-id-card-repi-page',
  templateUrl: './device-order-ais-existing-best-buy-validate-customer-id-card-repi-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-validate-customer-id-card-repi-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyValidateCustomerIdCardRepiPageComponent implements OnInit, OnDestroy {

  transaction: Transaction;
  profile: ReadCardProfile;
  zipcode: string;
  readCardValid: boolean;
  mobileNo: string;
  priceOption: PriceOption;
  user: User;

  @ViewChild(ValidateCustomerIdCardComponent)
  validateCustomerIdcard: ValidateCustomerIdCardComponent;

  constructor(
    private router: Router,
    private utils: Utils,
    private homeService: HomeService,
    private alertService: AlertService,
    private customerInfoService: CustomerInfoService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private pageLoadingService: PageLoadingService,
    private tokenService: TokenService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.user = this.tokenService.getUser();
  }

  ngOnInit(): void {
    this.transaction.data.action = TransactionAction.READ_CARD_REPI;
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
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_VALIDATE_CUSTOMER_REPI_PAGE]);
  }

  onNext(): void {
    const mobileNo = this.transaction.data.simCard.mobileNo;

    this.pageLoadingService.openLoading();
    this.customerInfoService.getProvinceId(this.profile.province).then((provinceId: string) => {
      return this.customerInfoService.getZipCode(provinceId, this.profile.amphur, this.profile.tumbol).then((zipCode: string) => {
        return this.customerInfoService.getCustomerInfoByIdCard(this.profile.idCardNo, zipCode).then((customer: Customer) => {
          if (customer.caNumber) {
            this.transaction.data.customer = { ...this.transaction.data.customer, ...customer, ...this.profile };
            this.transaction.data.customer.zipCode = zipCode;
          } else {
            const privilege = this.transaction.data.customer.privilegeCode;
            const repi = this.transaction.data.customer.repi;
            this.transaction.data.customer = null;
            this.transaction.data.customer = this.profile;
            this.transaction.data.customer.privilegeCode = privilege;
            this.transaction.data.customer.repi = repi;
            this.transaction.data.customer.zipCode = zipCode;
          }
          this.transaction.data.billingInformation = {};
          this.transaction.data.billingInformation.billDeliveryAddress = this.transaction.data.customer;
          // verify Prepaid Ident
          return this.customerInfoService.verifyPrepaidIdent(this.profile.idCardNo, mobileNo)
            .then((respPrepaidIdent: any) => {
              if (respPrepaidIdent) {
                const expireDate = this.profile.expireDate;
                if (!this.utils.isIdCardExpiredDate(expireDate)) {
                  this.pageLoadingService.closeLoading();
                  this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_PAYMENT_DETAIL_PAGE]);
                } else {
                  this.alertService.error('ไม่สามารถทำรายการได้ เนื่องจากบัตรประชาชนหมดอายุ');
                }
              } else {
                const expireDate = this.profile.expireDate;
                if (!this.utils.isIdCardExpiredDate(expireDate)) {
                  const simCard = this.transaction.data.simCard;
                  if (simCard.chargeType === 'Pre-paid') {
                    this.pageLoadingService.closeLoading();
                    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CUSTOMER_PROFILE_PAGE]);
                  } else {
                    this.pageLoadingService.closeLoading();
                    this.alertService.error('ไม่สามารถทำรายการได้ เบอร์รายเดือน ข้อมูลการแสดงตนไม่ถูกต้อง');
                  }
                } else {
                  this.pageLoadingService.closeLoading();
                  this.alertService.error('ไม่สามารถทำรายการได้ เนื่องจากบัตรประชาชนหมดอายุ');
                }
              }
            });
        }).catch((e) => this.alertService.error(e));
      }).catch((e) => this.alertService.error(e));
    }).catch((e) => this.alertService.error(e))
    .then(() => this.pageLoadingService.closeLoading());
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}
