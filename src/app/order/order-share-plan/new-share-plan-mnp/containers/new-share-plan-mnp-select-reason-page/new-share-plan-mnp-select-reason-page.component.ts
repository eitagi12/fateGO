import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_ORDER_NEW_SHARE_PLAN_MNP } from 'src/app/order/constants/wizard.constant';
import { ROUTE_NEW_SHARE_PLAN_MNP_NETWORK_TYPE_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_SELECT_PACKAGE_MEMBER_PAGE } from '../../constants/route-path.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ChargeType, PageLoadingService } from 'mychannel-shared-libs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-new-share-plan-mnp-select-reason-page',
  templateUrl: './new-share-plan-mnp-select-reason-page.component.html',
  styleUrls: ['./new-share-plan-mnp-select-reason-page.component.scss']
})
export class NewSharePlanMnpSelectReasonPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_ORDER_NEW_SHARE_PLAN_MNP;
  transaction: Transaction;
  reasonForm: FormGroup;
  reasons: any[];

  constructor(
    private transactionService: TransactionService,
    private router: Router,
    private fb: FormBuilder,
    private pageLoadingService: PageLoadingService,
    private http: HttpClient
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.createForm();
    this.callService();
  }

  onBack(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_NETWORK_TYPE_PAGE]);
  }

  onNext(): void {
    this.transaction.data.reasonCode = this.reasonForm.value.reasonCode;
    this.transaction.data.simCard = {
      ...this.transaction.data.simCard,
      mobileNoMember: this.transaction.data.simCard.mobileNoMember,
      chargeType: ChargeType.POST_PAID
    };
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_SELECT_PACKAGE_MEMBER_PAGE]);
  }

  createForm(): void {
    this.reasonForm = this.fb.group({
      reasonCode: ['', Validators.required],
      chargeType: [{ value: ChargeType.POST_PAID, disabled: true }, Validators.required]
    });
  }

  callService(): void {
    this.pageLoadingService.openLoading();
    this.http.get(`/api/customerportal/newRegister/queryOrderReasonByType`).toPromise()
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
