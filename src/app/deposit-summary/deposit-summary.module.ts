import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepositSummaryRoutingModule } from './deposit-summary-routing.module';
import { DepositSummaryComponent } from './deposit-summary.component';
import { DepositPaymentPageComponent } from './ais/container/deposit-payment-page/deposit-payment-page.component';
import { DepositPaymentSummaryPageComponent } from './ais/container/deposit-payment-summary-page/deposit-payment-summary-page.component';
import { MyChannelSharedLibsModule } from 'mychannel-shared-libs';

@NgModule({
  imports: [
    CommonModule,
    DepositSummaryRoutingModule,
    MyChannelSharedLibsModule
  ],
  declarations: [DepositSummaryComponent, DepositPaymentPageComponent, DepositPaymentSummaryPageComponent]
})
export class DepositSummaryModule { }
