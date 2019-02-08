import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageLoadingService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { TradeInService } from '../../services/trade-in.service';
import { TradeInTransactionService } from '../../services/trade-in-transaction.service';
import { TradeInTranscation } from '../../services/models/trade-in-transcation.model';

@Component({
  selector: 'app-confirm-trade-in-page',
  templateUrl: './confirm-trade-in-page.component.html',
  styleUrls: ['./confirm-trade-in-page.component.scss']
})
export class ConfirmTradeInPageComponent implements OnInit , OnDestroy {
  tradeInTransaction: TradeInTranscation;
  aisFlg: string;
  tradeinPrice: any;
  tradeinGrade: string;
  tradeinNo: string;
  btnNextDisabled = true;
  constructor(private router: Router,
    private tradeInService: TradeInService,
    private pageLoadingService: PageLoadingService,
    private tradeInTransactionService: TradeInTransactionService) {
      this.tradeInTransaction = this.tradeInTransactionService.load();

     }

  ngOnInit() {
    this.getEstimateTradein();
  }

  getEstimateTradein() {
    this.pageLoadingService.openLoading();
    if (this.tradeInTransaction.data.tradeIn.matCode) {
      this.aisFlg = 'Y';
    } else {
      this.aisFlg = 'N';
    }
    const objFilterValDesc = this.tradeInTransaction.data.tradeIn.listValuation.map(
      (data) => {
        return {
          valCode: data.valCode,
          valChecked: data.valChecked
        };
      }
    );
    const objRequestEstimate = {
      brand: this.tradeInTransaction.data.tradeIn.brand,
      model: this.tradeInTransaction.data.tradeIn.model,
      matCode: this.tradeInTransaction.data.tradeIn.matCode,
      serialNo: this.tradeInTransaction.data.tradeIn.serialNo,
      aisFlg: this.aisFlg,
      listValuation: objFilterValDesc
    };
    this.tradeInService.getEstimateTradein(objRequestEstimate).then(
      (response) => {
        if (response.data.resultCode === 'S') {
          this.tradeinGrade = response.data.tradeinGrade;
          this.tradeinPrice = response.data.tradeinPrice;
          this.tradeinNo = response.data.tradeinNo;
          this.nextDisabled();
        }
        this.pageLoadingService.closeLoading();
      });
  }

  onHome() {
    window.location.href = '/sales-portal/dashboard';
  }

  onBack() {
    this.tradeInTransaction.data.tradeIn.tradeInNo = null;
    this.tradeInTransaction.data.tradeIn.tradeInGrade = null;
    this.tradeInTransaction.data.tradeIn.tradeInPrice = null;
    this.router.navigate(['trade-in/criteria-trade-in']);
  }

  btnCancelFn() {
    this.tradeInTransaction.data.tradeIn.listValuation = null;
    this.tradeInTransaction.data.tradeIn.tradeInNo = null;
    this.tradeInTransaction.data.tradeIn.tradeInGrade = null;
    this.tradeInTransaction.data.tradeIn.tradeInPrice = null;
    this.router.navigate(['trade-in/criteria-trade-in']);
  }

  nextDisabled() {
    if (this.tradeinPrice > 0) {
      this.btnNextDisabled = false;
    } else if (this.tradeinPrice === 0) {
      this.btnNextDisabled = true;
    }
  }
  onNext () {
    this.tradeInTransaction.data.tradeIn.tradeInNo = this.tradeinNo;
    this.tradeInTransaction.data.tradeIn.tradeInGrade = this.tradeinGrade;
    this.tradeInTransaction.data.tradeIn.tradeInPrice = this.tradeinPrice;
    this.router.navigate(['trade-in/summary-trade-in']);
  }
  ngOnDestroy(): void {
    this.tradeInTransactionService.update(this.tradeInTransaction);
  }
}
