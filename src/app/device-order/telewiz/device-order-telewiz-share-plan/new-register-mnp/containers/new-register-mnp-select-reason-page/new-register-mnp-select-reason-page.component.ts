import { Component, OnInit, OnDestroy } from '@angular/core';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ChargeType, PageLoadingService } from 'mychannel-shared-libs';
import { HttpClient } from '@angular/common/http';
import {
  ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_NETWORK_TYPE,
  ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_CONFIRM_USER_INFORMATION_PAGE
} from '../../constants/route-path.constant';
import {
  WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN_TELEWIZ,
  WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN_JAYMART
} from 'src/app/device-order/constants/wizard.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { RemoveCartService } from '../../services/remove-cart.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
@Component({
  selector: 'app-new-register-mnp-select-reason-page',
  templateUrl: './new-register-mnp-select-reason-page.component.html',
  styleUrls: ['./new-register-mnp-select-reason-page.component.scss']
})
export class NewRegisterMnpSelectReasonPageComponent implements OnInit, OnDestroy {
 wizards: string[];
 wizardJaymart: string[] = WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN_JAYMART;
 wizardTelewiz: string[] = WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN_TELEWIZ;
  transaction: Transaction;
  reasonForm: FormGroup;
  reasons: any[];
  priceOption: PriceOption;

  constructor(
    private transactionService: TransactionService,
    private router: Router,
    private fb: FormBuilder,
    private pageLoadingService: PageLoadingService,
    private http: HttpClient,
    private removeCartService: RemoveCartService,
    private priceOptionService: PriceOptionService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
    this.checkJaymart();
    this.createForm();
    this.callService();
  }

  checkJaymart(): void {
    const outChnSale = this.priceOption.queryParams.isRole;
    if (outChnSale && (outChnSale === 'Retail Chain' || outChnSale === 'RetailChain')) {
      this.wizards = this.wizardJaymart;
    } else {
      this.wizards = this.wizardTelewiz;
    }
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_NETWORK_TYPE]);
  }

  onNext(): void {
    this.transaction.data.simCard.memberSimCard[0] = {
      ...this.transaction.data.simCard.memberSimCard[0],
      reasonCode: this.reasonForm.value.reasonCode
    };
    this.router.navigate([ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_CONFIRM_USER_INFORMATION_PAGE]);
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

  onHome(): void {
    this.removeCartService.backToReturnStock('/', this.transaction);
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}
