import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, ReadCardProfile, PageLoadingService, AlertService, TokenService, ChannelType, Utils, ValidateCustomerIdCardComponent, KioskControls } from 'mychannel-shared-libs';
import { Transaction, TransactionAction } from 'src/app/shared/models/transaction.model';
import { ROUTE_ORDER_PRE_TO_POST_VALIDATE_CUSTOMER_REPI_PAGE, ROUTE_ORDER_PRE_TO_POST_CUSTOMER_INFO_PAGE, ROUTE_ORDER_PRE_TO_POST_CUSTOMER_PROFILE_PAGE, ROUTE_ORDER_PRE_TO_POST_CURRENT_INFO_PAGE, ROUTE_ORDER_PRE_TO_POST_VERIFY_DOCUMENT_REPI_PAGE } from 'src/app/order/order-pre-to-post/constants/route-path.constant';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-order-pre-to-post-validate-customer-id-card-repi-page',
  templateUrl: './order-pre-to-post-validate-customer-id-card-repi-page.component.html',
  styleUrls: ['./order-pre-to-post-validate-customer-id-card-repi-page.component.scss']
})
export class OrderPreToPostValidateCustomerIdCardRepiPageComponent implements OnInit, OnDestroy {

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
    private utils: Utils,
    private http: HttpClient,
    private homeService: HomeService,
    private alertService: AlertService,
    private tokenService: TokenService,
    private transactionService: TransactionService,
    private pageLoadingService: PageLoadingService,
  ) {
    this.transaction = this.transactionService.load();
    this.kioskApi = this.tokenService.getUser().channelType === ChannelType.SMART_ORDER;
  }

  ngOnInit() {
    this.transaction.data.action = TransactionAction.READ_CARD_REPI;
  }

  onError(valid: boolean) {
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

  onCompleted(profile: ReadCardProfile) {
    this.profile = profile;

    this.onNext();
  }

  onBack() {
    this.router.navigate([ROUTE_ORDER_PRE_TO_POST_VERIFY_DOCUMENT_REPI_PAGE]);
  }

  onNext() {
    const mobileNo = this.transaction.data.simCard.mobileNo;

    this.pageLoadingService.openLoading();


    this.getZipCode(this.profile.province, this.profile.amphur, this.profile.tumbol)
      .then((zipCode: string) => {
        return this.http.get('/api/customerportal/validate-customer-pre-to-post', {
          params: {
            identity: this.profile.idCardNo,
            idCardType: this.profile.idCardType
          }
        }).toPromise()
          .then((resp: any) => {
            const data = resp.data || {};
            return {
              caNumber: data.caNumber,
              isNewCa: false,
              mainMobile: data.mainMobile,
              billCycle: data.billCycle,
              zipCode: zipCode
            };
          });
      })
      .then((customer: any) => { // load bill cycle
        this.transaction.data.customer = Object.assign(this.profile, customer);

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
              if (this.checkBusinessLogic()) {
                this.router.navigate([ROUTE_ORDER_PRE_TO_POST_CUSTOMER_INFO_PAGE]);
              }
            } else {
              this.transaction.data.action = TransactionAction.READ_CARD_REPI;
              if (this.checkBusinessLogic()) {
                this.router.navigate([ROUTE_ORDER_PRE_TO_POST_CUSTOMER_PROFILE_PAGE]);
              }
            }
            this.pageLoadingService.closeLoading();
          });
      })
      .catch((resp: any) => {
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


  checkBusinessLogic(): boolean {
    const birthdate = this.transaction.data.customer.birthdate;
    const expireDate = this.transaction.data.customer.expireDate;
    const idCardType = this.transaction.data.customer.idCardType;

    if (this.utils.isLowerAge17Year(birthdate)) {
      this.alertService.error('ไม่สามารถทำรายการได้ เนื่องจากอายุของผู้ใช้บริการต่ำกว่า 17 ปี').then(() => {
        this.onBack();
      });
      return false;
    }
    if (this.utils.isIdCardExpiredDate(expireDate)) {
      this.alertService.error('ไม่สามารถทำรายการได้ เนื่องจาก' + idCardType + 'หมดอายุ').then(() => {
        this.onBack();
      });
      return false;
    }
    return true;
  }

  onHome() {
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
