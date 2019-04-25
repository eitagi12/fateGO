import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PromotionPageComponent } from './containers/promotion-page/promotion-page.component';

const routes: Routes = [
  { path: '', component: PromotionPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
