import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VasPackageMenuVasRomPageComponent } from './containers/vas-package-menu-vas-rom-page/vas-package-menu-vas-rom-page.component';
import { VasPackageSelectVasPackagePageComponent } from './containers/vas-package-select-vas-package-page/vas-package-select-vas-package-page.component';
import { VasPackageLoginWithPinPageComponent } from './containers/vas-package-login-with-pin-page/vas-package-login-with-pin-page.component';
import { VasPackageOtpPageComponent } from './containers/vas-package-otp-page/vas-package-otp-page.component';
import { VasPackageCurrentBalancePageComponent } from './containers/vas-package-current-balance-page/vas-package-current-balance-page.component';
import { VasPackageResultPageComponent } from './containers/vas-package-result-page/vas-package-result-page.component';
const routes: Routes = [
  { path: '', redirectTo: 'menu-vas-rom', pathMatch: 'full' },
  { path: 'menu-vas-rom', component: VasPackageMenuVasRomPageComponent },
  { path: 'select-vas-package', component: VasPackageSelectVasPackagePageComponent },
  { path: 'login-with-pin', component: VasPackageLoginWithPinPageComponent },
  { path: 'otp', component: VasPackageOtpPageComponent },
  { path: 'current-balance', component: VasPackageCurrentBalancePageComponent },
  { path: 'result', component: VasPackageResultPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VasPackageRoutingModule { }
