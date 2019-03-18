import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DepositPaymentPageComponent } from './ais/container/deposit-payment-page/deposit-payment-page.component';
import { DepositPaymentSummaryPageComponent } from './ais/container/deposit-payment-summary-page/deposit-payment-summary-page.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'payment-detail', pathMatch: 'full'
  },
  {
    path: 'payment-detail', component: DepositPaymentPageComponent
  },
  {
    path: 'deposit-payment-summary', component: DepositPaymentSummaryPageComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepositSummaryRoutingModule {

}
