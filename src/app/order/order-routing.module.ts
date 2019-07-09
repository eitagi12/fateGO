import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'mychannel-shared-libs';
import { ErrorPageComponent } from '../containers/error-page/error-page.component';

const routes: Routes = [
  {
    path: 'new-register',
    loadChildren: 'src/app/order/order-new-register/order-new-register.module#OrderNewRegisterModule',
  },
  {
    path: 'pre-to-post',
    loadChildren: 'src/app/order/order-pre-to-post/order-pre-to-post.module#OrderPreToPostModule',
  },
  {
    path: 'mnp',
    loadChildren: 'src/app/order/order-mnp/order-mnp.module#OrderMnpModule',
  },
  {
    path: 'block-chain',
    loadChildren: 'src/app/order/order-blcok-chain/order-blcok-chain.module#OrderBlcokChainModule',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
