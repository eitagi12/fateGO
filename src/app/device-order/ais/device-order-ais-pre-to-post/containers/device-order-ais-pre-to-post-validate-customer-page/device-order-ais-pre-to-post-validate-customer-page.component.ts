import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HomeService, PageLoadingService, Utils, AlertService, TokenService, ChannelType } from 'mychannel-shared-libs';
import { ROUTE_BUY_PRODUCT_CAMPAIGN_PAGE } from 'src/app/buy-product/constants/route-path.constant';
import {
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_VALIDATE_CUSTOMER_ID_CARD_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_CURRENT_INFO_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_ELIGIBLE_MOBILE_PAGE
} from '../../constants/route-path.constant';
import { Transaction, TransactionType, TransactionAction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-device-order-ais-pre-to-post-validate-customer-page',
  templateUrl: './device-order-ais-pre-to-post-validate-customer-page.component.html',
  styleUrls: ['./device-order-ais-pre-to-post-validate-customer-page.component.scss']
})
export class DeviceOrderAisPreToPostValidateCustomerPageComponent implements OnInit, OnDestroy {

  priceOption: PriceOption;

  transaction: Transaction;

  identityValid: boolean = false;
  identity: string;

  constructor(
    private utils: Utils,
    private router: Router,
    private homeService: HomeService,
    private http: HttpClient,
    private alertService: AlertService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private tokenService: TokenService,
  ) {
    this.priceOption = this.priceOptionService.load();
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
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_VALIDATE_CUSTOMER_ID_CARD_PAGE]);
  }

  onBack(): void {
    this.router.navigate([ROUTE_BUY_PRODUCT_CAMPAIGN_PAGE], { queryParams: this.priceOption.queryParams });
  }

  onNext(): void {
    this.pageLoadingService.openLoading();

    if (this.utils.isMobileNo(this.identity)) {
      this.http.get('/api/customerportal/validate-customer-mobile-no-pre-to-post', {
        params: {
          mobileNo: this.identity
        }
      }).toPromise()
        .then((resp: any) => {
          this.transaction.data.simCard = { mobileNo: this.identity, persoSim: false };
          this.transaction.data.action = TransactionAction.KEY_IN_REPI;
          this.pageLoadingService.closeLoading();
          this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_CURRENT_INFO_PAGE]);
        })
        .catch((resp: any) => {
          this.alertService.error(resp.error.developerMessage);
        });
      return;
    }

    this.http.get('/api/customerportal/validate-customer-pre-to-post', {
      params: {
        identity: this.identity
      }
    }).toPromise()
      .then((resp: any) => {
        const data = resp.data || [];
        this.transaction.data.customer = data;
      })
      .then(() => { // load bill cycle
        return this.http.get(`/api/customerportal/newRegister/${this.identity}/queryBillingAccount`).toPromise()
          .then((resp: any) => {
            const data = resp.data || {};
            return this.http.post('/api/customerportal/verify/billingNetExtreme', {
              businessType: '1',
              listBillingAccount: data.billingAccountList
            }).toPromise()
              .then((respBillingNetExtreme: any) => {
                if (respBillingNetExtreme.data.length > 0) {
                  return {
                    billCycles: data.billingAccountList,
                    billCyclesNetExtreme: respBillingNetExtreme.data
                  };
                } else {
                  return {
                    billCycles: data.billingAccountList
                  };
                }
              })
              .catch(() => {
                return {
                  billCycles: data.billingAccountList
                };
              });
          });
      })
      .then((billingInformation: any) => {
        this.transaction.data.billingInformation = billingInformation;
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_ELIGIBLE_MOBILE_PAGE]);
      })
      .catch((resp: any) => {
        this.alertService.error(resp.error.developerMessage);
      })
      .then(() => {
        this.pageLoadingService.closeLoading();
      });
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  customerValidate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const length = control.value.length;

    if (this.utils.isMobileNo(value)) {
      return null;
    } else {
      return {
        message: 'กรุณากรอกหมายเลขโทรศัพท์ให้ถูกต้อง',
      };
    }
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }

  private createTransaction(): void {
    this.transaction = {
      data: {
        transactionType: TransactionType.DEVICE_ORDER_PRE_TO_POST_AIS,
        action: TransactionAction.KEY_IN,
      }
    };
    delete this.transaction.data.customer;
  }

  private mapCustomer(customer: any): void {
    const fullName = (customer.name || ' ').split(' ');
    const address = customer.address || {};

    this.transaction.data.customer = {
      idCardNo: this.identity,
      idCardType: customer.idCardType,
      titleName: customer.accntTitle,
      firstName: fullName[0],
      lastName: fullName[1],
      birthdate: customer.birthdate,
      gender: customer.gender,
      homeNo: address.homeNo,
      moo: address.moo,
      mooBan: address.mooban,
      buildingName: address.buildingName,
      floor: address.floor,
      room: address.room,
      street: address.street,
      soi: address.soi,
      tumbol: address.tumbol,
      amphur: address.amphur,
      province: address.province,
      firstNameEn: '',
      lastNameEn: '',
      issueDate: customer.birthdate,
      expireDate: null,
      zipCode: address.zipCode,
      mainMobile: customer.mainMobile,
      mainPhone: customer.mainPhone,
      billCycle: customer.billCycle,
      caNumber: customer.accntNo,
      imageSignature: '',
      imageSmartCard: '',
      imageReadSmartCard: '',
    };
  }
}
