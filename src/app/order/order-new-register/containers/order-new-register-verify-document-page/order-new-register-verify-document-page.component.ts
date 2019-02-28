import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_ORDER_NEW_REGISTER_PASSPOPRT_INFO_PAGE, ROUTE_ORDER_NEW_REGISTER_VALIDATE_CUSTOMER_ID_CARD_PAGE, ROUTE_ORDER_NEW_REGISTER_VERIFY_DOCUMENT_PAGE } from 'src/app/order/order-new-register/constants/route-path.constant';
import { HomeService, PageLoadingService, ApiRequestService, Utils, ReadCardProfile, AlertService, ReadPassport, ReadPassportService, ValidateCustomerIdCardComponent, KioskControls, VendingApiService, ReadCardService, } from 'mychannel-shared-libs';
import { Subscription } from 'rxjs/internal/Subscription';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction, TransactionType, TransactionAction } from 'src/app/shared/models/transaction.model';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-order-new-register-verify-document-page',
  templateUrl: './order-new-register-verify-document-page.component.html',
  styleUrls: ['./order-new-register-verify-document-page.component.scss']
})
export class OrderNewRegisterVerifyDocumentPageComponent implements OnInit, OnDestroy {
  readPassportSubscription: Subscription;
  vendingApiSubscription: Subscription;
  readPassprot: ReadPassport;
  profile: ReadCardProfile;
  transaction: Transaction;
  kioskApi = true;
  cardStateInterval: any;
  closeVendingApi: any;
  @ViewChild(ValidateCustomerIdCardComponent)
  validateCustomerIdcard: ValidateCustomerIdCardComponent;

  readonly ERR_MASSEAGE = 'ไม่สามารถให้บริการได้ กรุณาติดต่อพนักงานเพื่อดำเนินการ ขออภัยในความไม่สะดวก';

  constructor(
    private router: Router,
    private homeService: HomeService,
    private utils: Utils,
    private http: HttpClient,
    private transactionService: TransactionService,
    private readPassportService: ReadPassportService,
    private pageLoadingService: PageLoadingService,
    private apiRequestService: ApiRequestService,
    private alertService: AlertService,
    private vendingApiService: VendingApiService,
    private readCardService: ReadCardService,
    private translation: TranslateService
  ) {
  }

  ngOnInit() {
    this.createTransaction();
    this.onReadCard();
    this.onReadPassport();
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

  onReadPassport() {
    this.readPassportSubscription = this.readPassportService.onReadPassport().subscribe((readPassport: ReadPassport) => {
      console.log('readpassport', readPassport);
      if (readPassport.error) {
        this.alertService.error(this.translation.instant(this.ERR_MASSEAGE));
        return;
      } else if (readPassport.profile && readPassport.profile.idCardNo) {
        this.pageLoadingService.openLoading();
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
          this.router.navigate([ROUTE_ORDER_NEW_REGISTER_PASSPOPRT_INFO_PAGE]);
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
          this.alertService.error(this.ERR_MASSEAGE);
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
          this.router.navigate([ROUTE_ORDER_NEW_REGISTER_VALIDATE_CUSTOMER_ID_CARD_PAGE]);
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
        this.router.navigate([ROUTE_ORDER_NEW_REGISTER_VERIFY_DOCUMENT_PAGE]);
      });
      return false;
    }
    if (this.utils.isIdCardExpiredDate(expireDate)) {
      this.alertService.error(this.translation.instant('ไม่สามารถทำรายการได้ เนื่องจาก' + idCardType + 'หมดอายุ')).then(() => {
        this.router.navigate([ROUTE_ORDER_NEW_REGISTER_VERIFY_DOCUMENT_PAGE]);
      });
      return false;
    }
    return true;
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
      this.closeVendingApi.ws.send(KioskControls.LED_OFF);
    }
    this.readPassportSubscription.unsubscribe();
    clearInterval(this.cardStateInterval);
    this.vendingApiSubscription.unsubscribe();
  }

}
