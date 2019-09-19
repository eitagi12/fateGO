import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeviceOrderComponent } from './device-order.component';

const routes: Routes = [
  {
    path: 'ais',
    component: DeviceOrderComponent,
    children: [
      {
        path: 'new-register',
        loadChildren: 'src/app/device-order/ais/device-order-ais-new-register/device-order-ais-new-register.module#DeviceOrderAisNewRegisterModule'
      },
      {
        path: 'pre-to-post',
        loadChildren: 'src/app/device-order/ais/device-order-ais-pre-to-post/device-order-ais-pre-to-post.module#DeviceOrderAisPreToPostModule',
      },
      {
        path: 'mnp',
        loadChildren: 'src/app/device-order/ais/device-order-ais-mnp/device-order-ais-mnp.module#DeviceOrderAisMnpModule',
      },
      {
        path: 'existing',
        loadChildren: 'src/app/device-order/ais/device-order-ais-existing/device-order-ais-existing.module#DeviceOrderAisExistingModule',
      },
      // {
      //   path: 'best-buy',
      //   loadChildren: 'src/app/device-order/ais/device-order-ais-existing-best-buy/device-order-ais-existing-best-buy.module#DeviceOrderAisExistingBestBuyModule'
      // },
      {
        path: 'prepaid-hotdeal',
        loadChildren: 'src/app/device-order/ais/device-order-ais-existing-prepaid-hotdeal/device-order-ais-existing-prepaid-hotdeal.module#DeviceOrderAisExistingPrepaidHotdealModule'
      },
      {
        path: 'best-buy-shop',
        loadChildren: 'src/app/device-order/ais/device-order-ais-existing-best-buy-shop/device-order-ais-existing-best-buy-shop.module#DeviceOrderAisExistingBestBuyShopModule'
      },
      {
        path: 'existing-gadget',
        loadChildren: 'src/app/device-order/ais/device-order-ais-existing-gadget/device-order-ais-existing-gadget.module#DeviceOrderAisExistingGadgetModule'
      },
      {
        path: 'device',
        loadChildren: 'src/app/device-order/ais/device-order-ais-device/device-order-ais-device.module#DeviceOrderAisDeviceModule'
      },
      {
        path: 'share-plan',
        loadChildren: 'src/app/device-order/ais/device-order-ais-share-plan/device-order-ais-share-plan.module#DeviceOrderAisSharePlanModule'
      }
    ]
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
      {
        path: 'best-buy',
        loadChildren: 'src/app/device-order/asp/device-order-asp-existing-best-buy/device-order-asp-existing-best-buy.module#DeviceOrderAspExistingBestBuyModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceOrderRoutingModule { }
