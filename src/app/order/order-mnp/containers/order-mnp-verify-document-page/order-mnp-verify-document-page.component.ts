import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReadPassport, ReadCard, ReadCardProfile, ValidateCustomerIdCardComponent, HomeService, Utils, ReadPassportService, ApiRequestService, PageLoadingService, AlertService, ReadCardService, ReadCardEvent } from 'mychannel-shared-libs';
import { Transaction, BillDeliveryAddress, TransactionType, TransactionAction } from 'src/app/shared/models/transaction.model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ROUTE_ORDER_MNP_VERIFY_DOCUMENT_PAGE, ROUTE_ORDER_MNP_PASSPOPRT_INFO_PAGE, ROUTE_ORDER_MNP_VALIDATE_CUSTOMER_ID_CARD_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-order-mnp-verify-document-page',
  templateUrl: './order-mnp-verify-document-page.component.html',
  styleUrls: ['./order-mnp-verify-document-page.component.scss']
})
export class OrderMnpVerifyDocumentPageComponent implements OnInit {

  readPassportSubscription: Subscription;
  readCardSubscription: Subscription;
  readPassprot: ReadPassport;
  readCard: ReadCard;
  profile: ReadCardProfile;
  transaction: Transaction;
  billDeliveryAddress: BillDeliveryAddress;
  kioskApi = true;
  koiskApiFn: any;

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
    private readCardService: ReadCardService,
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
    // this.homeService.goToHome();
    this.router.navigate([ROUTE_ORDER_MNP_VERIFY_DOCUMENT_PAGE]);
  }
  onReadPassport() {
    const customer = this.transaction.data.customer;
    this.readPassportService.onReadPassport().subscribe((readPassport: ReadPassport) => {
      console.log('readPassport', readPassport);
      return this.http.get('/api/customerportal/validate-customer-new-register', {
        params: {
          identity: readPassport.profile.idCardNo
        }
      }).toPromise()
        .then((resp: any) => {
          const data = resp.data || {};
          this.billDeliveryAddress = {
            homeNo: data.homeNo || '',
            moo: data.moo || '',
            mooBan: data.mooBan || '',
            room: data.room || '',
            floor: data.floor || '',
            buildingName: data.buildingName || '',
            soi: data.soi || '',
            street: data.street || '',
            province: data.province || '',
            amphur: data.amphur || '',
            tumbol: data.tumbol || '',
            zipCode: data.zipCode || '',
          };
          return {
            caNumber: data.caNumber,
            mainMobile: data.mainMobile,
            billCycle: data.billCycle,
            // zipCode: zipCode
          };
        }).then((resp) => {
          this.transaction.data.customer = Object.assign(readPassport.profile, customer);
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
          this.transaction.data.billingInformation.billDeliveryAddress = this.billDeliveryAddress;
          if (this.checkBusinessLogic()) {
            this.router.navigate([ROUTE_ORDER_MNP_PASSPOPRT_INFO_PAGE]);
          }
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
    });
  }

  onReadCard() {
    console.log('บัตรประชาชน');
    // if (this.kioskApi) {
    //   this.koiskApiFn = this.readCardService.kioskApi();
    // }
    this.readCardSubscription = this.readCardService.onReadCard().subscribe((readCard: ReadCard) => {
      console.log('readCard', readCard);
      this.readCard = readCard;
      if (readCard.eventName === ReadCardEvent.EVENT_CARD_LOAD_COMPLETED) {
        this.router.navigate([ROUTE_ORDER_MNP_VALIDATE_CUSTOMER_ID_CARD_PAGE]);
      }
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
  private createTransaction() {
    // New x-api-request-id
    this.apiRequestService.createRequestId();

    this.transaction = {
      data: {
        transactionType: TransactionType.ORDER_MNP,
        action: TransactionAction.READ_PASSPORT,
      }
    };
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy(): void {
    this.readCardSubscription.unsubscribe();
    this.transactionService.save(this.transaction);
  }

}
