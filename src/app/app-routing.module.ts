import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, ApiRequestGuard, I18nService } from 'mychannel-shared-libs';
import { ErrorPageComponent } from './containers/error-page/error-page.component';
import { MainMenuGuard } from './shared/guards/main-menu.guard';

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
    canActivate: [AuthGuard, ApiRequestGuard]
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
    path: 'deposit-summary',
    loadChildren: 'src/app/deposit-summary/deposit-summary.module#DepositSummaryModule',
    canActivate: [AuthGuard, ApiRequestGuard]
  },
  {
    path: 'error',
    component: ErrorPageComponent
  },
  {
    path: 'trade-in',
    loadChildren: 'src/app/trade-in/trade-in.module#TradeInModule',
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
