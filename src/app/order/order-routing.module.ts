import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'mychannel-shared-libs';
import { ErrorPageComponent } from '../containers/error-page/error-page.component';

const routes: Routes = [
  {
    path: 'new-register',
    loadChildren: 'src/app/order/order-new-register/order-new-register.module#OrderNewRegisterModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'pre-to-post',
    loadChildren: 'src/app/order/order-pre-to-post/order-pre-to-post.module#OrderPreToPostModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'mnp',
    loadChildren: 'src/app/order/order-mnp/order-mnp.module#OrderMnpModule',
    canActivate: [AuthGuard]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
