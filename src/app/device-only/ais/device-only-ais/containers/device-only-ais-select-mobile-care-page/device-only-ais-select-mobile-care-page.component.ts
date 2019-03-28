import { Component, OnInit, OnDestroy } from '@angular/core';
import { ROUTE_DEVICE_ONLY_AIS_SELECT_PAYMENT_AND_RECEIPT_INFORMATION_PAGE, ROUTE_DEVICE_ONLY_AIS_SUMMARY_PAGE } from '../../constants/route-path.constant';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { HomeService, AlertService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { CreateOrderService } from '../../services/create-order.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { HomeButtonService } from '../../services/home-button.service';

@Component({
  selector: 'app-device-only-ais-select-mobile-care-page',
  templateUrl: './device-only-ais-select-mobile-care-page.component.html',
  styleUrls: ['./device-only-ais-select-mobile-care-page.component.scss']
})
export class DeviceOnlyAisSelectMobileCarePageComponent implements OnInit , OnDestroy {
  transaction: Transaction;
  public isBuyMobileCare: boolean = false;
  public isReasonNotBuyMobileCare: string;
  public promotionMock: any = [{
    id: '1',
    title: 'AIS Mobile Care-Swap+Replace เหมาจ่าย 12 เดือน 969',
    priceExclVat: '969'
  },
  {
    id: '2',
    title: 'AIS Mobile Care-Swap+Replace รายเดือน 89 บาท',
    priceExclVat: '89'
  }];

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private homeButtonService: HomeButtonService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.homeButtonService.initEventButtonHome();
  }

  public onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ONLY_AIS_SELECT_PAYMENT_AND_RECEIPT_INFORMATION_PAGE]);
  }

  public onHome(): void {
    this.homeService.goToHome();
  }

  public onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ONLY_AIS_SUMMARY_PAGE]);
  }

  public checkBuyMobileCare(buymobilecare: boolean): void {
    this.isBuyMobileCare = buymobilecare;
  }

  public ReasonNotBuyMobileCare(reasonnotbuymobilecare: string): void {
    this.isReasonNotBuyMobileCare = reasonnotbuymobilecare;
    this.transaction.data.reasonCode = this.isReasonNotBuyMobileCare;
    console.log('Reason ==========>' , this.isReasonNotBuyMobileCare);

  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }

}
