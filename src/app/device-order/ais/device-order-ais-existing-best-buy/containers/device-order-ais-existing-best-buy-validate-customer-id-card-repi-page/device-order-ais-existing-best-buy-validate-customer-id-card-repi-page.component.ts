import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { ReadCardProfile, ValidateCustomerIdCardComponent, Utils, HomeService, AlertService, TokenService, PageLoadingService } from 'mychannel-shared-libs';
import { Transaction, TransactionAction, Customer } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_VALIDATE_CUSTOMER_REPI_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CUSTOMER_PROFILE_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_PAYMENT_DETAIL_PAGE } from '../../constants/route-path.constant';
import { CustomerInfoService } from '../../services/customer-info.service';

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
    private pageLoadingService: PageLoadingService,
  ) {
    this.transaction = this.transactionService.load();
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
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_VALIDATE_CUSTOMER_REPI_PAGE]);
  }

  onNext(): void {
    const mobileNo = this.transaction.data.simCard.mobileNo;

    this.pageLoadingService.openLoading();

    this.customerInfoService.getProvinceId(this.profile.province).then((provinceId: string) => {
      this.customerInfoService.getZipCode(provinceId, this.profile.amphur, this.profile.tumbol).then((zipCode: string) => {
        this.customerInfoService.getCustomerInfoByIdCard(this.profile.idCardNo, zipCode).then((customer: Customer) => {
          this.transaction.data.customer = Object.assign(this.profile, customer);
          this.transaction.data.billingInformation = { billDeliveryAddress : this.transaction.data.customer };
        });
      });
    });

    // this.getZipCode(this.profile.province, this.profile.amphur, this.profile.tumbol)
    //   .then((zipCode: string) => {
    //     return this.http.get('/api/customerportal/validate-customer-pre-to-post', {
    //       params: {
    //         identity: this.profile.idCardNo
    //       }
    //     }).toPromise()
    //       .then((resp: any) => {
    //         const data = resp.data || {};
    //         return {
    //           caNumber: data.caNumber,
    //           isNewCa: false,
    //           mainMobile: data.mainMobile,
    //           billCycle: data.billCycle,
    //           zipCode: zipCode
    //         };
    //       });
    //   })
    //   .then((customer: any) => { // load bill cycle
    //     this.transaction.data.customer = Object.assign(this.profile, customer);

    //     return this.http.get(`/api/customerportal/newRegister/${this.profile.idCardNo}/queryBillingAccount`).toPromise()
    //       .then((resp: any) => {
    //         const data = resp.data || {};
    //         return this.http.post('/api/customerportal/verify/billingNetExtreme', {
    //           businessType: '1',
    //           listBillingAccount: data.billingAccountList
    //         }).toPromise()
    //           .then((respBillingNetExtreme: any) => {
    //             return {
    //               billCycles: data.billingAccountList,
    //               billCyclesNetExtreme: respBillingNetExtreme.data
    //             };
    //           })
    //           .catch(() => {
    //             return {
    //               billCycles: data.billingAccountList
    //             };
    //           });
    //       });
    //   })
    //   .then((billingInformation: any) => {
    //     this.transaction.data.billingInformation = billingInformation;
    //   })
    //   .then(() => {// verify Prepaid Ident
    //     return this.http.get(`/api/customerportal/newRegister/verifyPrepaidIdent?idCard=${this.profile.idCardNo}&mobileNo=${mobileNo}`)
    //       .toPromise()
    //       .then((respPrepaidIdent: any) => {
    //         if (respPrepaidIdent.data && respPrepaidIdent.data.success) {
    //           if (this.checkBusinessLogic()) {
    //             this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_PAYMENT_DETAIL_PAGE]);
    //           }
    //         } else {
    //           this.transaction.data.action = TransactionAction.READ_CARD_REPI;
    //           if (this.checkBusinessLogic()) {
    //             this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CUSTOMER_PROFILE_PAGE]);
    //           }
    //         }
    //         this.pageLoadingService.closeLoading();
    //       });
    //   })
    //   .catch((resp: any) => {
    //     const error = resp.error || [];
    //     console.log(resp);

    //     if (error && error.errors.length > 0) {
    //       this.alertService.notify({
    //         type: 'error',
    //         html: error.errors.map((err) => {
    //           return '<li class="text-left">' + err + '</li>';
    //         }).join('')
    //       }).then(() => {
    //         this.onBack();
    //       });
    //     } else {
    //       this.alertService.error(error.resultDescription);
    //     }
    //   });
  }

  checkBusinessLogic(): boolean {
    const birthdate = this.transaction.data.customer.birthdate;
    const expireDate = this.transaction.data.customer.expireDate;
    const idCardType = this.transaction.data.customer.idCardType;

    if (this.utils.isLowerAge17Year(birthdate)) {
      this.alertService.error('ไม่สามารถทำรายการได้ เนื่องจากอายุของผู้ใช้บริการต่ำกว่า 17 ปี');
      return false;
    }
    if (this.utils.isIdCardExpiredDate(expireDate)) {
      this.alertService.error('ไม่สามารถทำรายการได้ เนื่องจาก' + idCardType + 'หมดอายุ');
      return false;
    }
    return true;
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
