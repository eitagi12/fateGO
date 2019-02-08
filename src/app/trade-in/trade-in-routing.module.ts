import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerifyTradeInPageComponent } from 'src/app/trade-in/containers/verify-trade-in-page/verify-trade-in-page.component';
import { ConfirmTradeInPageComponent } from 'src/app/trade-in/containers/confirm-trade-in-page/confirm-trade-in-page.component';
import { CriteriaTradeInPageComponent } from 'src/app/trade-in/containers/criteria-trade-in-page/criteria-trade-in-page.component';
import { SummaryTradeInPageComponent } from 'src/app/trade-in/containers/summary-trade-in-page/summary-trade-in-page.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'verify-trade-in', pathMatch: 'full'
  },
  {
    path: 'verify-trade-in', component: VerifyTradeInPageComponent
  },
  {
    path: 'criteria-trade-in', component: CriteriaTradeInPageComponent
  },
  {
    path: 'confirm-trade-in', component: ConfirmTradeInPageComponent
  },
  {
    path: 'summary-trade-in', component: SummaryTradeInPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TradeInRoutingModule { }
