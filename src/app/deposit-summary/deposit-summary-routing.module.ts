import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DepositPaymentPageComponent } from './ais/container/deposit-payment-page/deposit-payment-page.component';
import { DepositPaymentSummaryPageComponent } from './ais/container/deposit-payment-summary-page/deposit-payment-summary-page.component';
import { DepositQueueComponent } from './ais/container/deposit-queue/deposit-queue.component';
import { DepositResultComponent } from './ais/container/deposit-result/deposit-result.component';
import { DepositPaymentKeyInPageComponent } from './ais/container/deposit-payment-key-in-page/deposit-payment-key-in-page.component';
import { DepositPaymentReceiptPageComponent } from './ais/container/deposit-payment-receipt-page/deposit-payment-receipt-page.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'payment-detail', pathMatch: 'full'
  },
  {
    path: 'payment-detail', component: DepositPaymentPageComponent
  },
  {
    path: 'deposit-payment-summary', component: DepositPaymentSummaryPageComponent
  },
  {
    path: 'deposit-queue', component: DepositQueueComponent
  },
  {
    path: 'deposit-result', component: DepositResultComponent
  },
  {
    path: 'payment-detail-key-in', component: DepositPaymentKeyInPageComponent
  },
  {
    path: 'payment-detail-receipt', component: DepositPaymentReceiptPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepositSummaryRoutingModule {

}
