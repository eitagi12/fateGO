import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeviceOnlyAisSelectPaymentComponent } from './contrainers/device-only-ais-select-payment/device-only-ais-select-payment.component';

const routes: Routes = [
  {
    path: 'select-payment',
    component: DeviceOnlyAisSelectPaymentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceOnlyAisRoutingModule { }
