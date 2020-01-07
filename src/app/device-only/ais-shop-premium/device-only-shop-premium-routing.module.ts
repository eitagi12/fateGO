import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeviceOnlyShopPremiumPaymentPageComponent } from 'src/app/device-only/ais-shop-premium/containers/device-only-shop-premium-payment-page/device-only-shop-premium-payment-page.component';
import { DeviceOnlyShopPremiumAggregatePageComponent } from './containers/device-only-shop-premium-aggregate-page/device-only-shop-premium-aggregate-page.component';
import { DeviceOnlyShopPremiumQueuePageComponent } from './containers/device-only-shop-premium-queue-page/device-only-shop-premium-queue-page.component';
import { DeviceOnlyShopPremiumResultPageComponent } from './containers/device-only-shop-premium-result-page/device-only-shop-premium-result-page.component';
import { DeviceOnlyShopPremiumQrCodeGeneratorPageComponent } from './containers/device-only-shop-premium-qr-code-generator-page/device-only-shop-premium-qr-code-generator-page.component';
import { DeviceOnlyShopPremiumQrCodeQueuePageComponent } from './containers/device-only-shop-premium-qr-code-queue-page/device-only-shop-premium-qr-code-queue-page.component';
import { DeviceOnlyShopPremiumQrCodeResultPageComponent } from './containers/device-only-shop-premium-qr-code-result-page/device-only-shop-premium-qr-code-result-page.component';

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
  {
    path: 'aggregate',
    component: DeviceOnlyShopPremiumAggregatePageComponent
  },
  {
    path: 'queue',
    component: DeviceOnlyShopPremiumQueuePageComponent
  },
  {
    path: 'result',
    component: DeviceOnlyShopPremiumResultPageComponent
  },
  // {
  //   path: 'qr-code-summary',
  //   component:
  // },
  {
    path: 'qr-code-generator',
    component: DeviceOnlyShopPremiumQrCodeGeneratorPageComponent
  },
  {
    path: 'qr-code-queue',
    component: DeviceOnlyShopPremiumQrCodeQueuePageComponent
  },
  {
    path: 'qr-code-result',
    component: DeviceOnlyShopPremiumQrCodeResultPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceOnlyShopPremiumRoutingModule { }
