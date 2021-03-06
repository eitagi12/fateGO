import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { SimSerial, HomeService, PageLoadingService, AlertService, SimSerialComponent } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { WIZARD_OMNI_NEW_REGISTER } from 'src/app/omni/constants/wizard.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ROUTE_OMNI_NEW_REGISTER_FACE_CONFIRM_PAGE, ROUTE_OMNI_NEW_REGISTER_SUMMARY_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-omni-new-register-verify-instant-sim-page',
  templateUrl: './omni-new-register-verify-instant-sim-page.component.html',
  styleUrls: ['./omni-new-register-verify-instant-sim-page.component.scss']
})
export class OmniNewRegisterVerifyInstantSimPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_OMNI_NEW_REGISTER;

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

  ngOnInit(): void {
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

  onBack(): void {
    this.router.navigate([ROUTE_OMNI_NEW_REGISTER_FACE_CONFIRM_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_OMNI_NEW_REGISTER_SUMMARY_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}
