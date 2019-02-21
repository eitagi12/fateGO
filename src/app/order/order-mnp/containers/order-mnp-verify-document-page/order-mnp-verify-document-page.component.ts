import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReadPassport, ReadCard, ReadCardProfile, ValidateCustomerIdCardComponent, HomeService, Utils, ReadPassportService, ApiRequestService, PageLoadingService, AlertService, ReadCardService, ReadCardEvent, VendingApiService, KioskControls } from 'mychannel-shared-libs';
import { Transaction, BillDeliveryAddress, TransactionType, TransactionAction } from 'src/app/shared/models/transaction.model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import {
  ROUTE_ORDER_MNP_VERIFY_DOCUMENT_PAGE,
  ROUTE_ORDER_MNP_PASSPOPRT_INFO_PAGE,
  ROUTE_ORDER_MNP_VALIDATE_CUSTOMER_ID_CARD_PAGE,
  ROUTE_ORDER_MNP_RESULT_PAGE
 } from '../../constants/route-path.constant';

@Component({
  selector: 'app-order-mnp-verify-document-page',
  templateUrl: './order-mnp-verify-document-page.component.html',
  styleUrls: ['./order-mnp-verify-document-page.component.scss']
})
export class OrderMnpVerifyDocumentPageComponent implements OnInit {

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
  }

  ngOnInit() {
    this.transaction = this.transactionService.load();
    this.onReadCard();
    this.onReadPassport();
  }

  onCompleted(profile: ReadCardProfile) {
    this.profile = profile;
  }

  onBack() {
    this.router.navigate([ROUTE_ORDER_MNP_RESULT_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }

  onReadPassport() {
    this.readPassportSubscription = this.readPassportService.onReadPassport().subscribe((readPassport: ReadPassport) => {
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
          this.router.navigate([ROUTE_ORDER_MNP_PASSPOPRT_INFO_PAGE]);
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
          this.router.navigate([ROUTE_ORDER_MNP_VALIDATE_CUSTOMER_ID_CARD_PAGE]);
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
        this.router.navigate([ROUTE_ORDER_MNP_VERIFY_DOCUMENT_PAGE]);
      });
      return false;
    }
    if (this.utils.isIdCardExpiredDate(expireDate)) {
      this.alertService.error('ไม่สามารถทำรายการได้ เนื่องจาก' + idCardType + 'หมดอายุ').then(() => {
        this.router.navigate([ROUTE_ORDER_MNP_VERIFY_DOCUMENT_PAGE]);
      });
      return false;
    }
    return true;
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy(): void {
    if (this.transaction.data.action === TransactionAction.READ_PASSPORT) {
      this.closeVendingApi.ws.send(KioskControls.LED_OFF);
    }
    clearInterval(this.cardStateInterval);
    this.vendingApiSubscription.unsubscribe();
    this.readPassportSubscription.unsubscribe();
  }

}
