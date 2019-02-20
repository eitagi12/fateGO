import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  HomeService, PageLoadingService, ApiRequestService, Utils, ReadCardProfile, AlertService,
  ReadPassport, ReadPassportService, ValidateCustomerIdCardComponent,
  KioskControls, VendingApiService, ReadCardService,
} from 'mychannel-shared-libs';
import { Subscription } from 'rxjs/internal/Subscription';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction, TransactionType, TransactionAction } from 'src/app/shared/models/transaction.model';
import { HttpClient } from '@angular/common/http';
import {
  ROUTE_ORDER_PRE_TO_POST_CURRENT_INFO_PAGE,
  ROUTE_ORDER_PRE_TO_POST_VALIDATE_CUSTOMER_ID_CARD_PAGE,
  ROUTE_ORDER_PRE_TO_POST_PASSPORT_INFO_PAGE
} from '../../constants/route-path.constant';
import { AbstractControl, ValidationErrors, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

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
    private readCardService: ReadCardService
  ) {
  }

  ngOnInit() {
    this.createTransaction();
    this.createForm();
    this.onReadCard();
    this.onReadPassport();
    this.koiskApiFn = this.readCardService.kioskApi();
    // this.onNext();
    // this.readPassportService.readPassportFromWebSocket().subscribe((readPassprot: ReadPassprot) => {
    //   console.log('readPassprot', readPassprot);
    //   this.transaction.data.customer = this.readPassprot.profile;
    // });
    // this.readCardService.kioskApi().controls(KioskControls.GET_CARD_STATE).subscribe(msg => console.log('msg', msg));
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
    this.readPassportService.onReadPassport().subscribe((readPassport: ReadPassport) => {
      console.log('readpassport', readPassport);
      this.pageLoadingService.openLoading();
      if (readPassport.error) {
        this.alertService.error('ไม่สามารถอ่านบัตรได้ กรุณาติดต่อพนักงาน');
        return;
      }
      return this.http.get('/api/customerportal/validate-customer-new-register', {
        params: {
          identity: readPassport.profile.idCardNo
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
                return '<li class="text-left">' + err + '</li>';
              }).join('')
            }).then(() => {
              this.onBack();
            });
          } else if (error.resultDescription) {
            this.alertService.error(error.resultDescription);
          } else {
            this.alertService.error('ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้');

          }
        });
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
      this.alertService.error('ไม่สามารถทำรายการได้ เนื่องจากอายุของผู้ใช้บริการต่ำกว่า 17 ปี').then(() => {
        this.router.navigate([ROUTE_ORDER_PRE_TO_POST_CURRENT_INFO_PAGE]);
      });
      return false;
    }
    if (this.utils.isIdCardExpiredDate(expireDate)) {
      this.alertService.error('ไม่สามารถทำรายการได้ เนื่องจาก' + idCardType + 'หมดอายุ').then(() => {
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
        transactionType: TransactionType.ORDER_NEW_REGISTER,
        action: null,
      }
    };
  }

  ngOnDestroy(): void {

    if (this.transaction.data.action === TransactionAction.READ_PASSPORT) {
      console.log(this.closeVendingApi);
      // this.closeVendingApi.ws.send(KioskControls.LED_OFF);
    }
    clearInterval(this.cardStateInterval);
    this.vendingApiSubscription.unsubscribe();
  }


}
