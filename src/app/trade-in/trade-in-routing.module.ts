import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VerifyTradeInComponent } from './containers/verify-trade-in/verify-trade-in.component';
import { SummaryTradeInComponent } from './containers/summary-trade-in/summary-trade-in.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'verify-trade-in', pathMatch: 'full'
  },
  {
    path: 'verify-trade-in', component: VerifyTradeInComponent
  },
  {
    path: 'summary-trade-in', component: SummaryTradeInComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TradeInRoutingModule { }
