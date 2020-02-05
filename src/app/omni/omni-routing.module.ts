import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'mychannel-shared-libs';
import { ErrorPageComponent } from '../containers/error-page/error-page.component';

const routes: Routes = [
  {
    path: 'new-register',
    loadChildren: 'src/app/omni/omni-new-register/omni-new-register.module#OmniNewRegisterModule',
  },
  // {
  //   path: 'pre-to-post',
  //   loadChildren: 'src/app/order/order-pre-to-post/order-pre-to-post.module#OmniPreToPostModule',
  // },
  // {
  //   path: 'mnp',
  //   loadChildren: 'src/app/order/order-mnp/order-mnp.module#OmniMnpModule',
  // },
  // {
  //   path: 'block-chain',
  //   loadChildren: 'src/app/order/order-blcok-chain/order-blcok-chain.module#OmniBlockChainModule',
  // },
  // {
  //   path: 'share-plan',
  //   loadChildren: 'src/app/order/order-share-plan/order-share-plan.module#OmniSharePlanModule'
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OmniRoutingModule { }
