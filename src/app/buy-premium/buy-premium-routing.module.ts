import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrandPageComponent } from './containers/brand-page/brand-page.component';
import { ProductPageComponent } from './containers/product-page/product-page.component';
import { CampaignPageComponent } from './containers/campaign-page/campaign-page.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'brand', pathMatch: 'full'
  },
  {
    path: 'brand', component: BrandPageComponent
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
