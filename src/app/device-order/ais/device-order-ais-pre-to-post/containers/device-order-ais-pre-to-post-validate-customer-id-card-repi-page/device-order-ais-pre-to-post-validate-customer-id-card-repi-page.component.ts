import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HomeService, ReadCardProfile, PageLoadingService, AlertService, TokenService, ChannelType, ValidateCustomerIdCardComponent, KioskControls } from 'mychannel-shared-libs';

import {
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_CUSTOMER_INFO_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_CUSTOMER_PROFILE_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_CURRENT_INFO_PAGE
} from '../../constants/route-path.constant';
import { Transaction, TransactionAction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';

@Component({
  selector: 'app-device-order-ais-pre-to-post-validate-customer-id-card-repi-page',
  templateUrl: './device-order-ais-pre-to-post-validate-customer-id-card-repi-page.component.html',
  styleUrls: ['./device-order-ais-pre-to-post-validate-customer-id-card-repi-page.component.scss']
})
export class DeviceOrderAisPreToPostValidateCustomerIdCardRepiPageComponent implements OnInit, OnDestroy {

  kioskApi: boolean;
  transaction: Transaction;
  profile: ReadCardProfile;
  zipcode: string;
  readCardValid: boolean;
  mobileNo: string;

  @ViewChild(ValidateCustomerIdCardComponent)
  validateCustomerIdcard: ValidateCustomerIdCardComponent;

  constructor(
    private router: Router,
    private http: HttpClient,
    private homeService: HomeService,
    private alertService: AlertService,
    private tokenService: TokenService,
    private transactionService: TransactionService,
    private pageLoadingService: PageLoadingService,
  ) {
    this.transaction = this.transactionService.load();
    this.homeService.callback = () => {
      if (this.validateCustomerIdcard.koiskApiFn) {
        this.validateCustomerIdcard.koiskApiFn.controls(KioskControls.LED_OFF);
      }
      window.location.href = '/smart-shop';
    };
    this.kioskApi = this.tokenService.getUser().channelType === ChannelType.SMART_ORDER;
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
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_CURRENT_INFO_PAGE]);
  }

  onNext(): void {
    const mobileNo = this.transaction.data.simCard.mobileNo;

    this.pageLoadingService.openLoading();
    this.http.get('/api/customerportal/validate-customer-pre-to-post', {
      params: {
        identity: this.profile.idCardNo
      }
    }).toPromise()
      .then((resp: any) => {

        const data = resp.data || {};

        return this.getZipCode(this.profile.province, this.profile.amphur, this.profile.tumbol)
          .then((zipCode: string) => {
            this.transaction.data.customer = Object.assign(this.profile, {
              caNumber: data.caNumber,
              isNewCa: false,
              mainMobile: data.mainMobile,
              billCycle: data.billCycle,
              zipCode: zipCode
            });

          });

      })
      .then(() => { // load bill cycle
        return this.http.get(`/api/customerportal/newRegister/${this.profile.idCardNo}/queryBillingAccount`).toPromise()
          .then((resp: any) => {
            const data = resp.data || {};
            return this.http.post('/api/customerportal/verify/billingNetExtreme', {
              businessType: '1',
              listBillingAccount: data.billingAccountList
            }).toPromise()
              .then((respBillingNetExtreme: any) => {
                return {
                  billCycles: data.billingAccountList,
                  billCyclesNetExtreme: respBillingNetExtreme.data
                };
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
      })
      .then(() => {// verify Prepaid Ident
        return this.http.get(`/api/customerportal/newRegister/verifyPrepaidIdent?idCard=${this.profile.idCardNo}&mobileNo=${mobileNo}`)
          .toPromise()
          .then((respPrepaidIdent: any) => {
            if (respPrepaidIdent.data && respPrepaidIdent.data.success) {
              this.transaction.data.action = TransactionAction.READ_CARD;
              this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_CUSTOMER_INFO_PAGE]);
            } else {
              this.transaction.data.action = TransactionAction.READ_CARD_REPI;
              this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_CUSTOMER_PROFILE_PAGE]);
            }
          });
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

  getZipCode(province: string, amphur: string, tumbol: string): Promise<string> {
    province = province.replace(/มหานคร$/, '');
    return this.http.get('/api/customerportal/newRegister/getAllProvinces').toPromise()
      .then((resp: any) => {
        const provinceId = (resp.data.provinces.find((prov: any) => prov.name === province) || {}).id;

        return this.http.get(
          `/api/customerportal/newRegister/queryZipcode?provinceId=${provinceId}&amphurName=${amphur}&tumbolName=${tumbol}`
        ).toPromise();
      })
      .then((resp: any) => {
        if (resp.data.zipcodes && resp.data.zipcodes.length > 0) {
          return resp.data.zipcodes[0];
        } else {
          return Promise.reject('ไม่พบรหัสไปรษณีย์');
        }
      });
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}
