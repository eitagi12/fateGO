import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, ApiRequestGuard, I18nService } from 'mychannel-shared-libs';
import { ErrorPageComponent } from './containers/error-page/error-page.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'dashboard', pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: 'src/app/dashboard/dashboard.module#DashboardModule',
    canActivate: [AuthGuard, ApiRequestGuard]
  },
  {
    path: 'main-menu',
    loadChildren: 'src/app/main-menu/main-menu.module#MainMenuModule',
    canActivate: [AuthGuard, ApiRequestGuard]
  },
  {
    path: 'buy-product',
    loadChildren: 'src/app/buy-product/buy-product.module#BuyProductModule',
    canActivate: [AuthGuard, ApiRequestGuard],
    resolve: {
      i18n: I18nService
    }
  },
  {
    path: 'stock',
    loadChildren: 'src/app/stock/stock.module#StockModule',
    canActivate: [AuthGuard, ApiRequestGuard]
  },
  {
    path: 'device-order',
    loadChildren: 'src/app/device-order/device-order.module#DeviceOrderModule',
    canActivate: [AuthGuard, ApiRequestGuard],
    resolve: {
      i18n: I18nService
    }

  },
  {
    path: 'order',
    loadChildren: 'src/app/order/order.module#OrderModule',
    canActivate: [AuthGuard],
    resolve: {
      i18n: I18nService
    }
  },
  {
    path: 'device-only',
    loadChildren: 'src/app/device-only/device-only.module#DeviceOnlyModule',
    canActivate: [AuthGuard],
    resolve: {
      i18n: I18nService
    }
  },
  {
    path: 'error',
    component: ErrorPageComponent
  },
  {
    path: 'deposit-summary',
    loadChildren: 'src/app/deposit-summary/deposit-summary.module#DepositSummaryModule',
    canActivate: [AuthGuard, ApiRequestGuard]
  },
  {
    path: 'trade-in',
    loadChildren: 'src/app/trade-in/trade-in.module#TradeInModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'vas-package',
    loadChildren: 'src/app/vas-package/vas-package.module#VasPackageModule',
  },
  {
    path: 'rom-transaction',
    loadChildren: 'src/app/rom-transaction/rom-transaction.module#RomTransactionModule',
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
