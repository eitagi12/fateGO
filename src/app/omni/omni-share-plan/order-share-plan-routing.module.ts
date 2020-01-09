import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'new-share-plan-mnp',
    loadChildren: 'src/app/order/order-share-plan/new-share-plan-mnp/new-share-plan-mnp.module#NewSharePlanMnpModule'
  }];
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class OmniSharePlanRoutingModule { }
