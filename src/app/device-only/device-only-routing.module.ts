import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeviceOnlyComponent } from './device-only.component';

const routes: Routes = [
  {
    path: '',
    component: DeviceOnlyComponent,
    children: [
      {
        path: 'ais',
        loadChildren: 'src/app/device-only/ais/device-only-ais/device-only-ais.module#DeviceOnlyAisModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceOnlyRoutingModule { }
