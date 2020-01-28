import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductPageComponent } from './containers/product-page/product-page.component';
import { CampaignPageComponent } from './containers/campaign-page/campaign-page.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'product', pathMatch: 'full'
  },
  {
    path: 'product', component: ProductPageComponent
  },
  {
    path: 'campaign', component: CampaignPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuyPremiumRoutingModule { }
