import { Component, OnInit } from '@angular/core';
import { WIZARD_OMNI_NEW_REGISTER } from 'src/app/omni/constants/wizard.constant';
import { Router } from '@angular/router';
import { HomeService, AlertService, PageLoadingService } from 'mychannel-shared-libs';
import {
  ROUTE_OMNI_NEW_REGISTER_FACE_COMPARE_PAGE, ROUTE_OMNI_NEW_REGISTER_FACE_CAPTURE_PAGE, ROUTE_OMNI_NEW_REGISTER_SUMMARY_PAGE
} from 'src/app/omni/omni-new-register/constants/route-path.constant';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { Transaction } from 'src/app/omni/omni-shared/models/transaction.model';
import { TransactionService } from 'src/app/omni/omni-shared/services/transaction.service';

@Component({
  selector: 'app-omni-new-register-face-confirm-page',
  templateUrl: './omni-new-register-face-confirm-page.component.html',
  styleUrls: ['./omni-new-register-face-confirm-page.component.scss']
})
export class OmniNewRegisterFaceConfirmPageComponent implements OnInit {

  wizards: string[] = WIZARD_OMNI_NEW_REGISTER;
  transaction: Transaction;
  confirmForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private homeService: HomeService,
    private http: HttpClient,
    private pageLoadingService: PageLoadingService,
    private alertService: AlertService,
    private translation: TranslateService,
    private transactionService: TransactionService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
  }

  onBack(): void {
    this.router.navigate([ROUTE_OMNI_NEW_REGISTER_FACE_COMPARE_PAGE]);
  }

  onNext(): void {
    this.transaction.data.faceRecognition.kyc = true;
    this.router.navigate([ROUTE_OMNI_NEW_REGISTER_SUMMARY_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}
