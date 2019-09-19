import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeviceOrderAisSharePlanComponent } from './device-order-ais-share-plan.component';

const routes: Routes = [
    {
      path: '',
      children: [
        {
          path: 'new-register-mnp',
          loadChildren: 'src/app/device-order/ais/device-order-ais-share-plan/new-register-mnp/new-register-mnp.module#NewRegisterMnpModule'
        }
      ]
    }
  ];
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class DeviceOrderAisSharePlanRoutingModule { }
