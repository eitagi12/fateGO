import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeviceOnlyShopPremiumPaymentPageComponent } from 'src/app/device-only/shop-premium/containers/device-only-shop-premium-payment-page/device-only-shop-premium-payment-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'payment', pathMatch: 'full' },
  {
    path: 'payment',
    component: DeviceOnlyShopPremiumPaymentPageComponent
  },
  // {
  //   path: 'summary',
  //   component: DeviceOrderAisDeviceSummaryPageComponent
  // },
  // {
  //   path: 'aggregate',
  //   component:
  // },
  // {
  //   path: 'queue',
  //   component:
  // },
  // {
  //   path: 'result',
  //   component:
  // },
  // {
  //   path: 'qr-code-summary',
  //   component:
  // },
  // {
  //   path: 'qr-code-generator',
  //   component:
  // },
  // {
  //   path: 'qr-code-queue',
  //   component:
  // },
  // {
  //   path: 'qr-code-result',
  //   component:
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceOnlyShopPremiumRoutingModule { }
