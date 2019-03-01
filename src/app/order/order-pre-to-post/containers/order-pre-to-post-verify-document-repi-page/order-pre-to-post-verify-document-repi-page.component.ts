import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, PageLoadingService, ApiRequestService, Utils, ReadCardProfile, AlertService, ReadPassport, ReadPassportService, ValidateCustomerIdCardComponent, KioskControls, VendingApiService, ReadCardService, } from 'mychannel-shared-libs';
import { Subscription } from 'rxjs/internal/Subscription';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction, TransactionType, TransactionAction } from 'src/app/shared/models/transaction.model';
import { HttpClient } from '@angular/common/http';
import { ROUTE_ORDER_PRE_TO_POST_VALIDATE_CUSTOMER_ID_CARD_REPI_PAGE, ROUTE_ORDER_PRE_TO_POST_PASSPORT_INFO_REPI_PAGE, ROUTE_ORDER_PRE_TO_POST_CURRENT_INFO_PAGE } from '../../constants/route-path.constant';


@Component({
  selector: 'app-order-pre-to-post-verify-document-repi-page',
  templateUrl: './order-pre-to-post-verify-document-repi-page.component.html',
  styleUrls: ['./order-pre-to-post-verify-document-repi-page.component.scss']
})
export class OrderPreToPostVerifyDocumentRepiPageComponent implements OnInit, OnDestroy {
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
    private readCardService: ReadCardService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit() {
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
    this.router.navigate([ROUTE_ORDER_PRE_TO_POST_CURRENT_INFO_PAGE]);
    // this.router.navigate([ROUTE_ORDER_NEW_REGISTER_VERIFY_DOCUMENT_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }
  onReadPassport() {
    const mobileNo = this.transaction.data.simCard.mobileNo;
    this.readPassportSubscription = this.readPassportService.onReadPassport().subscribe((readPassport: ReadPassport) => {
      this.pageLoadingService.openLoading();
      if (readPassport.error) {
        this.alertService.error('ไม่สามารถอ่านบัตรได้ กรุณาติดต่อพนักงาน');
        return;
      }
      return this.http.get('/api/customerportal/validate-customer-pre-to-post', {
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
        })
        .then(() => {// verify Prepaid Ident
          const idCardNo = this.transaction.data.customer.idCardNo;
          return this.http.get(`/api/customerportal/newRegister/verifyPrepaidIdent?idCard=${idCardNo}&mobileNo=${mobileNo}`)
            .toPromise()
            .then((respPrepaidIdent: any) => {
              if (respPrepaidIdent.data && respPrepaidIdent.data.success) {
                if (this.checkBusinessLogic()) {
                  this.transaction.data.action = TransactionAction.READ_PASSPORT;
                }
              } else {
                if (this.checkBusinessLogic()) {
                  this.transaction.data.action = TransactionAction.READ_PASSPORT_REPI;
                }
              }
              this.transactionService.update(this.transaction);
              this.router.navigate([ROUTE_ORDER_PRE_TO_POST_PASSPORT_INFO_REPI_PAGE]);
              this.pageLoadingService.closeLoading();
            });
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
          this.router.navigate([ROUTE_ORDER_PRE_TO_POST_VALIDATE_CUSTOMER_ID_CARD_REPI_PAGE]);
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
      // return false;
      return true;
    }
    return true;
  }
  // private createTransaction() {
  //   // New x-api-request-id
  //   this.apiRequestService.createRequestId();

  //   this.transaction = {
  //     data: {
  //       transactionType: TransactionType.ORDER_NEW_REGISTER,
  //       action: null,
  //     }
  //   };
  // }

  ngOnDestroy(): void {
    // this.transactionService.update(this.transaction);
    if (this.transaction.data.action === TransactionAction.READ_PASSPORT && this.closeVendingApi.ws) {
      this.closeVendingApi.ws.send(KioskControls.LED_OFF);
    }
    clearInterval(this.cardStateInterval);
    this.vendingApiSubscription.unsubscribe();
    this.readPassportSubscription.unsubscribe();
  }


}
