import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
      path: 'ais',
      loadChildren: 'src/app/device-only/ais/device-only-ais/device-only-ais.module#DeviceOnlyAisModule'
  },
  {
    path: 'kiosk',
    loadChildren: 'src/app/device-only/kiosk/device-only-kiosk/device-only-kiosk.module#DeviceOnlyKioskModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceOnlyRoutingModule { }
