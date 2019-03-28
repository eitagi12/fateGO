import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { ReadCardProfile, ValidateCustomerIdCardComponent, Utils, HomeService, AlertService, TokenService, PageLoadingService } from 'mychannel-shared-libs';
import { Transaction, TransactionAction, Customer } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { ROUTE_DEVICE_ORDER_ASP_BEST_BUY_VALIDATE_CUSTOMER_REPI_PAGE, ROUTE_DEVICE_ORDER_ASP_BEST_BUY_PAYMENT_DETAIL_PAGE, ROUTE_DEVICE_ORDER_ASP_BEST_BUY_CUSTOMER_PROFILE_PAGE } from '../../constants/route-path.constant';

////////////////////////  ดึง Service จาก flow ais  /////////////////////////
import { CustomerInfoService } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/services/customer-info.service';
import { CreateDeviceOrderBestBuyService } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/services/create-device-order-best-buy.service';

@Component({
  selector: 'app-device-order-asp-existing-best-buy-validate-customer-id-card-repi-page',
  templateUrl: './device-order-asp-existing-best-buy-validate-customer-id-card-repi-page.component.html',
  styleUrls: ['./device-order-asp-existing-best-buy-validate-customer-id-card-repi-page.component.scss']
})
export class DeviceOrderAspExistingBestBuyValidateCustomerIdCardRepiPageComponent implements OnInit, OnDestroy {

  transaction: Transaction;
  profile: ReadCardProfile;
  zipcode: string;
  readCardValid: boolean;
  mobileNo: string;
  priceOption: PriceOption;

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
    private createDeviceOrderBestBuyService: CreateDeviceOrderBestBuyService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
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
    this.onNext();
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_ASP_BEST_BUY_VALIDATE_CUSTOMER_REPI_PAGE]);
  }

  onNext(): void {
    const mobileNo = this.transaction.data.simCard.mobileNo;

    this.pageLoadingService.openLoading();

    this.customerInfoService.getProvinceId(this.profile.province).then((provinceId: string) => {
      this.customerInfoService.getZipCode(provinceId, this.profile.amphur, this.profile.tumbol).then((zipCode: string) => {
        this.customerInfoService.getCustomerInfoByIdCard(this.profile.idCardNo, zipCode).then((customer: Customer) => {
          this.transaction.data.customer = Object.assign(this.profile, customer);
          this.transaction.data.billingInformation = {};
          // this.transaction.data.billingInformation.billDeliveryAddress = this.transaction.data.customer;
          // verify Prepaid Ident
          this.customerInfoService.verifyPrepaidIdent(this.profile.idCardNo, mobileNo)
            .then((respPrepaidIdent: any) => {
              if (respPrepaidIdent.data && respPrepaidIdent.data.success) {
                const expireDate = this.transaction.data.customer.expireDate;
                if (this.utils.isIdCardExpiredDate(expireDate)) {
                  this.createDeviceOrderBestBuyService.createAddToCartTrasaction(this.transaction, this.priceOption).then((transaction) => {
                    this.transaction = transaction;
                    this.pageLoadingService.closeLoading();
                    this.transaction.data.action = TransactionAction.READ_CARD;
                    this.router.navigate([ROUTE_DEVICE_ORDER_ASP_BEST_BUY_PAYMENT_DETAIL_PAGE]);
                  });
                }
              } else {
                const expireDate = this.transaction.data.customer.expireDate;
                this.transaction.data.action = TransactionAction.READ_CARD_REPI;
                if (this.utils.isIdCardExpiredDate(expireDate)) {
                  const simCard = this.transaction.data.simCard;
                  if (simCard.chargeType === 'Pre-paid') {
                    this.createDeviceOrderBestBuyService.createAddToCartTrasaction(this.transaction, this.priceOption)
                    .then((transaction) => {
                      this.transaction = transaction;
                      this.pageLoadingService.closeLoading();
                      this.router.navigate([ROUTE_DEVICE_ORDER_ASP_BEST_BUY_CUSTOMER_PROFILE_PAGE]);
                    });
                  } else {
                    this.alertService.error('ไม่สามารถทำรายการได้ เบอร์รายเดือน ข้อมูลการแสดงตนไม่ถูกต้อง');
                  }
                }
              }
              this.pageLoadingService.closeLoading();
            });
        });
      });
    }).catch((resp: any) => {
      const error = resp.error || [];
      console.log(resp);

      if (error && error.errors.length > 0) {
        this.alertService.notify({
          type: 'error',
          html: error.errors.map((err) => {
            return '<li class="text-left">' + err + '</li>';
          }).join('')
        }).then(() => {
          this.onBack();
        });
      } else {
        this.alertService.error(error.resultDescription);
      }
    });
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}
