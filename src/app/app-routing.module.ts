import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, ApiRequestGuard } from 'mychannel-shared-libs';
import { ErrorPageComponent } from './containers/error-page/error-page.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'dashboard', pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: 'src/app/dashboard/dashboard.module#DashboardModule',
    canActivate: [AuthGuard]
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
  },
  {
    path: 'deposit-summary',
    loadChildren: 'src/app/deposit-summary/deposit-summary.module#DepositSummaryModule',
    canActivate: [AuthGuard, ApiRequestGuard]
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
