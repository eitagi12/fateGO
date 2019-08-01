import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RomTransactionListMobilePageComponent } from './containers/rom-transaction-list-mobile-page/rom-transaction-list-mobile-page.component';
import { RomTransactionShowInformationPageComponent } from './containers/rom-transaction-show-information-page/rom-transaction-show-information-page.component';
import { RomTransactionResultPageComponent } from './containers/rom-transaction-result-page/rom-transaction-result-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'list-mobile', pathMatch: 'full' },
  { path: 'list-mobile', component: RomTransactionListMobilePageComponent },
  { path: 'show-information', component: RomTransactionShowInformationPageComponent },
  { path: 'result', component: RomTransactionResultPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RomTransactionRoutingModule { }
