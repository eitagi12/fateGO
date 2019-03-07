import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { HttpClient } from '@angular/common/http';
import { AbstractControl, ValidationErrors, FormBuilder, FormGroup, Validators } from '@angular/forms';

import {
  HomeService, PageLoadingService, ApiRequestService, Utils, ReadCardProfile, AlertService,
  ReadPassport, ReadPassportService, ValidateCustomerIdCardComponent,
  KioskControls, VendingApiService, ReadCardService,
} from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction, TransactionType, TransactionAction } from 'src/app/shared/models/transaction.model';
import {
  ROUTE_ORDER_PRE_TO_POST_CURRENT_INFO_PAGE,
  ROUTE_ORDER_PRE_TO_POST_VALIDATE_CUSTOMER_ID_CARD_PAGE,
  ROUTE_ORDER_PRE_TO_POST_PASSPORT_INFO_PAGE
} from '../../constants/route-path.constant';

@Component({
  selector: 'app-order-pre-to-post-verify-document-page',
  templateUrl: './order-pre-to-post-verify-document-page.component.html',
  styleUrls: ['./order-pre-to-post-verify-document-page.component.scss']
})
export class OrderPreToPostVerifyDocumentPageComponent implements OnInit, OnDestroy {
  readPassportSubscription: Subscription;
  vendingApiSubscription: Subscription;
  readPassprot: ReadPassport;
  profile: ReadCardProfile;
  transaction: Transaction;
  kioskApi = true;
  koiskApiFn: any;
  cardStateInterval: any;
  closeVendingApi: any;
  @ViewChild(ValidateCustomerIdCardComponent)
  validateCustomerIdcard: ValidateCustomerIdCardComponent;
  validateCustomerForm: FormGroup;

  readonly ERR_MASSEAGE = 'ไม่สามารถให้บริการได้ กรุณาติดต่อพนักงานเพื่อดำเนินการ ขออภัยในความไม่สะดวก';

  constructor(
    private router: Router,
    private homeService: HomeService,
    private fb: FormBuilder,
    private utils: Utils,
    private http: HttpClient,
    private transactionService: TransactionService,
    private readPassportService: ReadPassportService,
    private pageLoadingService: PageLoadingService,
    private apiRequestService: ApiRequestService,
    private alertService: AlertService,
    private vendingApiService: VendingApiService,
    private readCardService: ReadCardService,
    public translation: TranslateService
  ) {
  }

  ngOnInit() {
    this.createTransaction();
    this.createForm();
    this.onReadCard();
    this.onReadPassport();
    this.koiskApiFn = this.readCardService.kioskApi();
  }
  onCompleted(profile: ReadCardProfile) {
    this.profile = profile;
    // auto next
    this.onReadPassport();
  }
  onBack() {
    this.homeService.goToHome();
    // this.router.navigate([ROUTE_ORDER_NEW_REGISTER_VERIFY_DOCUMENT_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }

  createForm() {
    // nobileNo use pattern
    this.validateCustomerForm = this.fb.group({
      identity: ['', [Validators.required, this.customValidate.bind(this)]]
    });

    this.validateCustomerForm.valueChanges.pipe(debounceTime(750))
      .subscribe((value: any) => {
        if (this.validateCustomerForm.valid) {
          this.pageLoadingService.openLoading();
          this.http.get('/api/customerportal/validate-customer-mobile-no-pre-to-post', {
            params: {
              mobileNo: value.identity
            }
          }).toPromise()
            .then((resp: any) => {
              this.transaction.data.simCard = { mobileNo: value.identity, persoSim: false };
              this.transaction.data.action = TransactionAction.KEY_IN_REPI;
              this.pageLoadingService.closeLoading();
              this.transactionService.update(this.transaction);
              this.router.navigate([ROUTE_ORDER_PRE_TO_POST_CURRENT_INFO_PAGE]);
            })
            .catch((error: any) => {
              this.alertService.error(error.error.resultDescription);
            });
        }
      });
  }

  onReadPassport() {
    this.readPassportSubscription = this.readPassportService.onReadPassport().subscribe((readPassport: ReadPassport) => {
      this.pageLoadingService.openLoading();
      if (readPassport.error) {
        this.alertService.error(this.translation.instant(this.ERR_MASSEAGE));
        return;
      } else if (readPassport.profile && readPassport.profile.idCardNo) {
        return this.http.get('/api/customerportal/validate-customer-pre-to-post', {
          params: {
            identity: readPassport.profile.idCardNo,
            idCardType: readPassport.profile.idCardType
          }
          // catch ไว้ก่อน เดี๋ยวมาทำต่อ
        }).toPromise().catch(() => {
          return {};
        })
          .then((resp: any) => {
            const data = resp.data || {};
            return {
              caNumber: data.caNumber,
              mainMobile: data.mainMobile,
              billCycle: data.billCycle,
              // zipCode: zipCode
            };
          }).then((resp) => {
            this.transaction.data.customer = Object.assign(
              Object.assign({}, this.transaction.data.customer), readPassport.profile);
            return this.http.get(`/api/customerportal/newRegister/${readPassport.profile.idCardNo}/queryBillingAccount`).toPromise()
              .then((respQueryBilling: any) => {
                const data = respQueryBilling.data || {};
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
          }).then((billingInformation: any) => {
            this.transaction.data.billingInformation = billingInformation;
            this.pageLoadingService.closeLoading();
            this.transaction.data.action = TransactionAction.READ_PASSPORT;
            this.transactionService.update(this.transaction);
            this.router.navigate([ROUTE_ORDER_PRE_TO_POST_PASSPORT_INFO_PAGE]);
            // if (this.checkBusinessLogic()) {
            //   this.router.navigate([ROUTE_ORDER_NEW_REGISTER_PASSPOPRT_INFO_PAGE]);

            // }
          }).catch((resp: any) => {
            this.pageLoadingService.closeLoading();
            const error = resp.error || [];
            if (error && error.errors && error.errors.length > 0) {
              this.alertService.notify({
                type: 'error',
                html: error.errors.map((err) => {
                  return '<li class="text-left">' + this.translation.instant(err) + '</li>';
                }).join('')
              }).then(() => {
                this.onBack();
              });
            } else if (error.resultDescription) {
              this.alertService.error(this.translation.instant(error.resultDescription));
            } else {
              this.alertService.error(this.translation.instant('ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้'));

            }
          });
      } else {
        if (readPassport.eventName && readPassport.eventName === 'OnScanDocError') {
          this.alertService.error(this.translation.instant(this.ERR_MASSEAGE));
        }
      }
    });
  }

  onReadCard() {
    this.vendingApiSubscription = this.vendingApiService.excuteCommand().subscribe((command: any) => {
      this.closeVendingApi = command;
      if (command.error) {
        return;
      }
      command.ws.send(KioskControls.LED_BLINK);
      if (command.error) {
        return;

      }
      command.ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        const isCardInside = message && (message.Result === 'Card in IC position' || message.Result === 'Card in RF position');

        if (isCardInside) {
          this.router.navigate([ROUTE_ORDER_PRE_TO_POST_VALIDATE_CUSTOMER_ID_CARD_PAGE]);
        }

        if (message.Command === KioskControls.LOAD_CARD) {
          this.cardStateInterval = setInterval(function () {
            command.ws.send(KioskControls.GET_CARD_STATE);
          }, 1000);
        }


      };
      command.ws.send(KioskControls.LOAD_CARD);

    });
  }
  checkBusinessLogic(): boolean {
    const birthdate = this.transaction.data.customer.birthdate;
    const expireDate = this.transaction.data.customer.expireDate;
    const idCardType = this.transaction.data.customer.idCardType;

    if (this.utils.isLowerAge17Year(birthdate)) {
      this.alertService.error(this.translation.instant('ไม่สามารถทำรายการได้ เนื่องจากอายุของผู้ใช้บริการต่ำกว่า 17 ปี')).then(() => {
        this.router.navigate([ROUTE_ORDER_PRE_TO_POST_CURRENT_INFO_PAGE]);
      });
      return false;
    }
    if (this.utils.isIdCardExpiredDate(expireDate)) {
      this.alertService.error(this.translation.instant('ไม่สามารถทำรายการได้ เนื่องจาก' + idCardType + 'หมดอายุ')).then(() => {
        this.router.navigate([ROUTE_ORDER_PRE_TO_POST_CURRENT_INFO_PAGE]);
      });
      return false;
    }
    return true;
  }

  customValidate(control: AbstractControl): ValidationErrors {
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

  private createTransaction() {
    // New x-api-request-id
    this.apiRequestService.createRequestId();

    this.transaction = {
      data: {
        transactionType: TransactionType.ORDER_PRE_TO_POST,
        action: null,
      }
    };
  }

  ngOnDestroy(): void {

    if (this.transaction.data.action === TransactionAction.READ_PASSPORT && this.closeVendingApi.ws) {
      this.closeVendingApi.ws.send(KioskControls.LED_OFF);
    }
    clearInterval(this.cardStateInterval);
    this.vendingApiSubscription.unsubscribe();
    this.readPassportSubscription.unsubscribe();
  }
}
