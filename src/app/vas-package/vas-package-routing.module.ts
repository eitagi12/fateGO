import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuVasRomPageComponent } from './containers/menu-vas-rom-page/menu-vas-rom-page.component';
import { SelectVasPackagePageComponent } from './containers/select-vas-package-page/select-vas-package-page.component';
import { LoginWithPinPageComponent } from './containers/login-with-pin-page/login-with-pin-page.component';
import { OtpPageComponent } from './containers/otp-page/otp-page.component';
import { CurrentBalancePageComponent } from './containers/current-balance-page/current-balance-page.component';
import { ResultPageComponent } from './containers/result-page/result-page.component';
const routes: Routes = [
  { path: '', redirectTo: 'menu-vas-rom', pathMatch: 'full' },
  { path: 'menu-vas-rom', component: MenuVasRomPageComponent },
  { path: 'select-vas-package', component: SelectVasPackagePageComponent },
  { path: 'login-with-pin', component: LoginWithPinPageComponent },
  { path: 'select-vas-package', component: SelectVasPackagePageComponent },
  { path: 'otp', component: OtpPageComponent },
  { path: 'current-balance', component: CurrentBalancePageComponent },
  { path: 'result', component: ResultPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VasPackageRoutingModule { }
