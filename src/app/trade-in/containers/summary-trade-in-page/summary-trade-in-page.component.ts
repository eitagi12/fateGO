import { Component, OnInit } from '@angular/core';
import { TradeInTranscation } from '../../services/models/trade-in-transcation.model';
import { TradeInTransactionService } from '../../services/trade-in-transaction.service';
import { AisNativeService } from 'mychannel-shared-libs';
declare let window: any;
@Component({
  selector: 'app-summary-trade-in-page',
  templateUrl: './summary-trade-in-page.component.html',
  styleUrls: ['./summary-trade-in-page.component.scss']
})

export class SummaryTradeInPageComponent implements OnInit {
  // aisNative: any = window.aisNative;
  tradeInTransaction: TradeInTranscation;
  tradeinNo: string;
  brand: string;
  modelTradein: string;
  imeiTradein: string;
  tradeinPrice: string;
  tradeinGrade: string;
  company: string;
  unLockOs: string;
  platform: string;

  constructor(private tradeInTransactionService: TradeInTransactionService,
    private aisNativeService: AisNativeService) {
    this.tradeInTransaction = this.tradeInTransactionService.load();
  }

  ngOnInit() {
    this.summaryTradein();
  }

  summaryTradein() {
    const tradeInTransaction = this.tradeInTransaction.data.tradeIn;
    this.tradeinNo = tradeInTransaction.tradeInNo;
    this.brand = tradeInTransaction.brand;
    this.modelTradein = tradeInTransaction.model;
    this.tradeinGrade = tradeInTransaction.tradeInGrade;
    this.imeiTradein = tradeInTransaction.serialNo;
    this.tradeinPrice = tradeInTransaction.tradeInPrice;
    this.company = tradeInTransaction.company;
    this.platform = this.brand === 'APPLE' ? 'iCloud' : 'Google Play';
  }

  gotoMainMenu() {
    window.location.href = '/sales-portal/dashboard';
  }

  gotoPrintSummary() {
    const price: any = +this.tradeinPrice;
    const tradePrint = {
      tradeinNo: this.tradeinNo || '-',
      brand: this.brand || '-',
      modelTradein: this.modelTradein || '-',
      tradeinGrade: this.tradeinGrade || '-',
      imeiTradein: this.imeiTradein || '-',
      tradeinPrice: `${price.toLocaleString()} บาท (รวม VAT)` || '-',
      company: this.company || '-',
      unLockOs: `ปลดล็อค ${this.platform} และ Reset เครื่อง`
    };
    this.aisNativeService.printThermalTradeIn(JSON.stringify(tradePrint));
    // window.aisNative.printThermalTradeIn(JSON.stringify(tradePrint));
  }
}
