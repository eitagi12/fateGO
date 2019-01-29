import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageLoadingService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { TradeInService } from '../../services/trade-in.service';
import { TradeInTranscation } from '../../services/models/trade-in-transcation.model';
import { TradeInTransactionService } from '../../services/trade-in-transaction.service';

@Component({
  selector: 'app-criteria-trade-in',
  templateUrl: './criteria-trade-in.component.html',
  styleUrls: ['./criteria-trade-in.component.scss']
})
export class CriteriaTradeInComponent implements OnInit , OnDestroy {
  tradeInTransaction: TradeInTranscation;
  valuationlists: any;
  objCriteriatradein: any;
  objTradein: any;
  btnNextDisabled = true;
  valuationlistForm: FormGroup;
  criteriatradein: any;

  constructor(private router: Router,
    private tradeInService: TradeInService,
    private pageLoadingService: PageLoadingService,
    private fb: FormBuilder,
    private tradeInTransactionService: TradeInTransactionService,
    ) {
      this.tradeInTransaction = this.tradeInTransactionService.load();
     }

  ngOnInit() {
    this.setFormValuation();
    this.ListValuationTradein();
  }

  ListValuationTradein() {
    if (this.tradeInTransaction.data.tradeIn.listValuation) {
      this.valuationlists = this.tradeInTransaction.data.tradeIn.listValuation;
      this.btnNextDisabled = false;
    } else {
      this.pageLoadingService.openLoading();
      const brand: string = this.tradeInTransaction.data.tradeIn.brand;
      const model: string = this.tradeInTransaction.data.tradeIn.model;
      this.tradeInService.getListValuationTradein(brand, model).then(
        (res: any) => {
          this.valuationlists = res.data.listValuation;
          for (const item of this.valuationlists) {
            item.valChecked = 'N';
          }
          this.setFormValuation();
          this.pageLoadingService.closeLoading();
        },
        (err: any) => {
          this.pageLoadingService.closeLoading();
        });
    }
  }

  selectValuationlistFn(val: any, checked: any) {
    if (checked.target.checked === true) {
      val.valChecked = 'Y';
    } else if (checked.target.checked === false) {
      val.valChecked = 'N';
    }
    this.onDeleteChk();
  }

  onDeleteChk() {
    let iChk = 0;
    for (const itemCount of this.valuationlists) {
      if (itemCount.valChecked === 'Y') {
        iChk++;
      }
    }
    if (iChk === 0) {
      this.btnNextDisabled = true;
    } else {
      this.btnNextDisabled = false;
    }
  }

  setFormValuation() {
    this.valuationlistForm = this.fb.group({
      listVuation: ['', Validators.required]
    });
  }

  onHome() {
    this.tradeInTransactionService.remove();
    window.location.href = '/sales-portal/dashboard';
  }

  onBack() {
    this.tradeInTransactionService.remove();
    this.router.navigate(['trade-in/verify-trade-in']);
  }

  onCancel() {
    this.valuationlistForm.reset();
  }

  onNext() {
    this.tradeInTransaction.data.tradeIn.listValuation = this.valuationlists;
    this.router.navigate(['trade-in/confirm-trade-in']);
  }

  ngOnDestroy(): void {
    this.tradeInTransactionService.update(this.tradeInTransaction);
  }
}
