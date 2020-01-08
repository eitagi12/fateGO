import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeviceOnlyShopPremiumPaymentPageComponent } from 'src/app/device-only/ais-shop-premium/containers/device-only-shop-premium-payment-page/device-only-shop-premium-payment-page.component';
import { DeviceOnlyShopPremiumAggregatePageComponent } from './containers/device-only-shop-premium-aggregate-page/device-only-shop-premium-aggregate-page.component';
import { DeviceOnlyShopPremiumQueuePageComponent } from './containers/device-only-shop-premium-queue-page/device-only-shop-premium-queue-page.component';
import { DeviceOnlyShopPremiumResultPageComponent } from './containers/device-only-shop-premium-result-page/device-only-shop-premium-result-page.component';
import { DeviceOnlyShopPremiumQrCodeGeneratorPageComponent } from './containers/device-only-shop-premium-qr-code-generator-page/device-only-shop-premium-qr-code-generator-page.component';
import { DeviceOnlyShopPremiumQrCodeSummaryPageComponent } from 'src/app/device-only/ais-shop-premium/containers/device-only-shop-premium-qr-code-summary-page/device-only-shop-premium-qr-code-summary-page.component';
import { DeviceOnlyShopPremiumSummaryPageComponent } from 'src/app/device-only/ais-shop-premium/containers/device-only-shop-premium-summary-page/device-only-shop-premium-summary-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'payment', pathMatch: 'full' },
  {
    path: 'payment',
    component: DeviceOnlyShopPremiumPaymentPageComponent
  },
  {
    path: 'summary',
    component: DeviceOnlyShopPremiumSummaryPageComponent
  },
  {
    path: 'aggregate',
    component: DeviceOnlyShopPremiumAggregatePageComponent
  },
  {
    path: 'qr-code-summary',
    component: DeviceOnlyShopPremiumQrCodeSummaryPageComponent
  },
  {
    path: 'qr-code-generator',
    component: DeviceOnlyShopPremiumQrCodeGeneratorPageComponent
  },
  {
    path: 'result',
    component: DeviceOnlyShopPremiumResultPageComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceOnlyShopPremiumRoutingModule { }
