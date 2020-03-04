import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
      path: '',
      children: [
        {
          path: 'new-register-mnp',
          loadChildren: 'src/app/device-order/telewiz/device-order-telewiz-share-plan/new-register-mnp/new-register-mnp.module#NewRegisterMnpModule'
        }
      ]
    }
  ];
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class DeviceOrderTelewizSharePlanRoutingModule { }
