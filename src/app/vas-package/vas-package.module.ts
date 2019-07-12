import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VasPackageRoutingModule } from './vas-package-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyChannelSharedLibsModule } from 'mychannel-shared-libs';
import { MenuVasRomPageComponent } from './containers/menu-vas-rom-page/menu-vas-rom-page.component';
import { SelectVasPackagePageComponent } from './containers/select-vas-package-page/select-vas-package-page.component';
import { LoginWithPinPageComponent } from './containers/login-with-pin-page/login-with-pin-page.component';
import { OtpPageComponent } from './containers/otp-page/otp-page.component';
import { CurrentBalancePageComponent } from './containers/current-balance-page/current-balance-page.component';
import { ResultPageComponent } from './containers/result-page/result-page.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    VasPackageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MyChannelSharedLibsModule,
    TranslateModule
  ],
  declarations: [
    MenuVasRomPageComponent,
    SelectVasPackagePageComponent,
    LoginWithPinPageComponent,
    OtpPageComponent,
    CurrentBalancePageComponent,
    ResultPageComponent]
})
export class VasPackageModule { }
