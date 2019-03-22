import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeviceOrderComponent } from './device-order.component';

const routes: Routes = [
  {
    // path: 'ais',
    // component: DeviceOrderComponent,
    // children: [
    //   {
    //     path: 'new-register',
    //     loadChildren: 'src/app/device-order/ais/device-order-ais-new-register/device-order-ais-new-register.module#DeviceOrderAisNewRegisterModule'
    //   },
    //   {
    //     path: 'pre-to-post',
    //     loadChildren: 'src/app/device-order/ais/device-order-ais-pre-to-post/device-order-ais-pre-to-post.module#DeviceOrderAisPreToPostModule',
    //   },
    //   {
    //     path: 'mnp',
    //     loadChildren: 'src/app/device-order/ais/device-order-ais-mnp/device-order-ais-mnp.module#DeviceOrderAisMnpModule',
    //   },
    //   {
    //     path: 'existing',
    //     loadChildren: 'src/app/device-order/ais/device-order-ais-existing/device-order-ais-existing.module#DeviceOrderAisExistingModule',
    //   },
    //   {
    //     path: 'prepaid-hotdeal',
    //     loadChildren: 'src/app/device-order/ais/device-order-ais-prepaid-hotdeal/device-order-ais-prepaid-hotdeal.module#DeviceOrderAisPrepaidHotdealModule',
    //   }
    // ]
  },
  {
    path: 'asp',
    children: [
      // {
      //   path: 'new-register',
      //   loadChildren: 'src/app/device-order/asp/device-order-asp-new-register.module#DeviceOrderAspNewRegisterModule',
      // },
      // {
      //   path: 'pre-to-post',
      //   loadChildren: 'src/app/device-order/asp/device-order-asp-new-pre-to-post.module#DeviceOrderAspPreToPostModule',
      // },
      // {
      //   path: 'mnp',
      //   loadChildren: 'src/app/device-order/asp/device-order-asp-mnp.module#DeviceOrderAspMnpModule',
      // },
      // {
      //   path: 'existing',
      //   loadChildren: 'src/app/device-order/asp/device-order-asp-existing.module#DeviceOrderAspExistingModule',
      // }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceOrderRoutingModule { }
