import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WIZARD_ORDER_MNP } from 'src/app/order/constants/wizard.constant';
import { HomeService, PageLoadingService, ChargeType } from 'mychannel-shared-libs';
import {
  ROUTE_ORDER_MNP_NETWORK_TYPE_PAGE,
  ROUTE_ORDER_MNP_VALIDATE_CUSTOMER_ID_CARD_PAGE
} from 'src/app/order/order-mnp/constants/route-path.constant';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';

@Component({
  selector: 'app-order-mnp-select-reason-page',
  templateUrl: './order-mnp-select-reason-page.component.html',
  styleUrls: ['./order-mnp-select-reason-page.component.scss']
})
export class OrderMnpSelectReasonPageComponent implements OnInit, OnDestroy {

  wizards = WIZARD_ORDER_MNP;

  transaction: Transaction;
  reasons: any[];
  reasonForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit() {
    this.pageLoadingService.openLoading();
    this.createForm();
    this.callService();
  }

  createForm(): void {
    this.reasonForm = this.fb.group({
      reasonCode: ['', Validators.required],
      chargeType: [{ value: ChargeType.POST_PAID, disabled: true }, Validators.required]
    });
  }

  onBack() {
    this.router.navigate([ROUTE_ORDER_MNP_NETWORK_TYPE_PAGE]);
  }

  onNext() {
    this.transaction.data.reasonCode = this.reasonForm.value.reasonCode;
    this.transaction.data.simCard = {
      mobileNo: this.transaction.data.simCard.mobileNo,
      chargeType : ChargeType.POST_PAID
    };
    this.router.navigate([ROUTE_ORDER_MNP_VALIDATE_CUSTOMER_ID_CARD_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }

  callService() {
    this.pageLoadingService.openLoading();
    this.http.get(`/api/customerportal/newRegister/queryOrderReasonByType`)
      .toPromise()
      .then((resp: any) => {
        const data = resp.data || [];
        this.reasons = data.map((reason: any) => {
          const parameter = reason.Parameter || [];
          return {
            reasonCode: parameter[0].Value,
            reasonName: parameter[1].Value
          };
        });

        if (this.reasons) {
          this.reasonForm.patchValue({
            reasonCode: this.reasons[0].reasonCode
          });
        }
      })
      .then(() => {
        this.pageLoadingService.closeLoading();
      });
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }


}
