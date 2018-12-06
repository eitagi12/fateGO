import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReservePageComponent } from './containers/reserve-page/reserve-page.component';
import { CheckingPageComponent } from './containers/checking-page/checking-page.component';

const routes: Routes = [
  {
    path: 'reserve', component: ReservePageComponent
  },
  {
    path: 'checking', component: CheckingPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockRoutingModule { }
