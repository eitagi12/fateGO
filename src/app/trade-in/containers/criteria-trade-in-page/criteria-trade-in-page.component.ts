import { Component, OnInit, OnDestroy } from '@angular/core';
import { TradeInTranscation } from '../../services/models/trade-in-transcation.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TradeInService } from '../../services/trade-in.service';
import { PageLoadingService } from 'mychannel-shared-libs';
import { TradeInTransactionService } from '../../services/trade-in-transaction.service';

@Component({
  selector: 'app-criteria-trade-in-page',
  templateUrl: './criteria-trade-in-page.component.html',
  styleUrls: ['./criteria-trade-in-page.component.scss']
})
export class CriteriaTradeInPageComponent implements OnInit, OnDestroy {
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

  ngOnInit(): void {
    this.setFormValuation();
    this.ListValuationTradein();
  }

  ListValuationTradein(): void {
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

  selectValuationlistFn(val: any, checked: any): void {
    if (checked.target.checked === true) {
      val.valChecked = 'Y';
    } else if (checked.target.checked === false) {
      val.valChecked = 'N';
    }
    this.onDeleteChk();
  }

  onDeleteChk(): void {
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

  setFormValuation(): void {
    this.valuationlistForm = this.fb.group({
      listVuation: ['', Validators.required]
    });
  }

  onHome(): void {
    this.tradeInTransactionService.remove();
    window.location.href = '/sales-portal/dashboard';
  }

  onBack(): void {
    this.tradeInTransactionService.remove();
    this.router.navigate(['trade-in/verify-trade-in']);
  }

  onCancel(): void {
    this.valuationlistForm.reset();
    for (const item of this.valuationlists) {
      item.valChecked = 'N';
    }
    this.btnNextDisabled = true;
  }

  onNext(): void {
    this.tradeInTransaction.data.tradeIn.listValuation = this.valuationlists;
    this.router.navigate(['trade-in/confirm-trade-in']);
  }

  ngOnDestroy(): void {
    this.tradeInTransactionService.update(this.tradeInTransaction);
  }

}
