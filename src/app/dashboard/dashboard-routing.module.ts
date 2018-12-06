import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { PromotionPageComponent } from './containers/promotion-page/promotion-page.component';
import { MainMenuPageComponent } from './containers/main-menu-page/main-menu-page.component';

const routes: Routes = [
  {
    path: '', component: DashboardComponent,
    children: [
      {
        path: '', component: PromotionPageComponent
      },
      {
        path: 'main-menu', component: MainMenuPageComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
