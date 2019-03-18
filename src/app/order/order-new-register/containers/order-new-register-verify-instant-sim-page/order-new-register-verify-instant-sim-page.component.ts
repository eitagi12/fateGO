import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {
  ROUTE_ORDER_NEW_REGISTER_SELECT_NUMBER_PAGE,
  ROUTE_ORDER_NEW_REGISTER_SELECT_PACKAGE_PAGE
} from 'src/app/order/order-new-register/constants/route-path.constant';
import { SimSerial, HomeService, PageLoadingService, AlertService, SimSerialComponent } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { WIZARD_ORDER_NEW_REGISTER } from 'src/app/order/constants/wizard.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-new-register-verify-instant-sim-page',
  templateUrl: './order-new-register-verify-instant-sim-page.component.html',
  styleUrls: ['./order-new-register-verify-instant-sim-page.component.scss']
})
export class OrderNewRegisterVerifyInstantSimPageComponent implements OnInit, OnDestroy {

  wizards = WIZARD_ORDER_NEW_REGISTER;

  transaction: Transaction;
  simSerial: SimSerial;
  simSerialValid: boolean;

  @ViewChild('mcSimSerial')
  mcSimSerial: SimSerialComponent;

  translationSubscribe: Subscription;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private pageLoadingService: PageLoadingService,
    private alertService: AlertService,
    private http: HttpClient,
    private translationService: TranslateService
  ) {
    this.transaction = this.transactionService.load();
    this.translationSubscribe = this.translationService.onLangChange.subscribe(lang => {
      this.mcSimSerial.focusInput();
    });
  }

  ngOnInit() {
    delete this.transaction.data.simCard;
  }

  onCheckSimSerial(serial: string): void {
    this.pageLoadingService.openLoading();
    this.http.get(`/api/customerportal/validate-verify-instant-sim?serialNo=${serial}`).toPromise()
      .then((resp: any) => {
        const simSerial = resp.data || [];
        this.simSerialValid = true;
        this.simSerial = {
          mobileNo: simSerial.mobileNo,
          simSerial: serial
        };
        this.transaction.data.simCard = {
          mobileNo: this.simSerial.mobileNo,
          simSerial: this.simSerial.simSerial,
          persoSim: false
        };
        this.pageLoadingService.closeLoading();
      }).catch((resp: any) => {
        this.simSerialValid = false;
        this.simSerial = undefined;
        const error = resp.error || [];
        this.pageLoadingService.closeLoading();
        this.alertService.notify({
          type: 'error',
          html: this.translationService.instant(error.resultDescription.replace(/<br>/, ' '))
        });
      });
  }

  onBack() {
    this.router.navigate([ROUTE_ORDER_NEW_REGISTER_SELECT_NUMBER_PAGE]);
  }

  onNext() {
    this.router.navigate([ROUTE_ORDER_NEW_REGISTER_SELECT_PACKAGE_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}
