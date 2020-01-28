import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'ais',
    loadChildren: 'src/app/device-only/ais/device-only-ais/device-only-ais.module#DeviceOnlyAisModule'
  },
  {
    path: 'asp',
    loadChildren: 'src/app/device-only/asp/device-only-asp/device-only-asp.module#DeviceOnlyAspModule'
  },
  {
    path: 'kiosk',
    loadChildren: 'src/app/device-only/kiosk/device-only-kiosk/device-only-kiosk.module#DeviceOnlyKioskModule'
  },
  {
    path: 'shop-premium',
    loadChildren: 'src/app/device-only/ais-shop-premium/device-only-shop-premium.module#DeviceOnlyShopPremiumModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceOnlyRoutingModule { }
