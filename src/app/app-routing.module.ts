import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'mychannel-shared-libs';
import { ErrorPageComponent } from './containers/error-page/error-page.component';
import { I18nService } from './shared/services/i18n.service';

const routes: Routes = [
  {
    path: '', redirectTo: 'dashboard', pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: 'src/app/dashboard/dashboard.module#DashboardModule',
    canActivate: [AuthGuard],
    resolve: {
      i18n: I18nService
    }
  },
  {
    path: 'buy-product',
    loadChildren: 'src/app/buy-product/buy-product.module#BuyProductModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'stock',
    loadChildren: 'src/app/stock/stock.module#StockModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'device-order',
    loadChildren: 'src/app/device-order/device-order.module#DeviceOrderModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'order',
    loadChildren: 'src/app/order/order.module#OrderModule',
    canActivate: [AuthGuard]
    // resolve: {
    //   i18n: I18nService
    // }
  },
  {
    path: 'error',
    component: ErrorPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
