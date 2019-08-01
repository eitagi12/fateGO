import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VasPackageRoutingModule } from './vas-package-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyChannelSharedLibsModule } from 'mychannel-shared-libs';
import { TranslateModule } from '@ngx-translate/core';
import { VasPackageMenuVasRomPageComponent } from './containers/vas-package-menu-vas-rom-page/vas-package-menu-vas-rom-page.component';
import { VasPackageSelectVasPackagePageComponent } from './containers/vas-package-select-vas-package-page/vas-package-select-vas-package-page.component';
import { VasPackageCurrentBalancePageComponent } from './containers/vas-package-current-balance-page/vas-package-current-balance-page.component';
import { VasPackageLoginWithPinPageComponent } from './containers/vas-package-login-with-pin-page/vas-package-login-with-pin-page.component';
import { VasPackageOtpPageComponent } from './containers/vas-package-otp-page/vas-package-otp-page.component';
import { VasPackageResultPageComponent } from './containers/vas-package-result-page/vas-package-result-page.component';
import { VasPackageSliderComponent, NetworkTypeFilter } from './containers/vas-package-select-vas-package-page/vas-package-slider/vas-package-slider.component';
import { TabsModule } from 'ngx-bootstrap';
import { VasPackageTabComponent } from './containers/vas-package-select-vas-package-page/vas-package-tab/vas-package-tab.component';

@NgModule({
  imports: [
    CommonModule,
    VasPackageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MyChannelSharedLibsModule,
    TranslateModule,
    TabsModule.forRoot()
  ],
  declarations: [
    VasPackageMenuVasRomPageComponent,
    VasPackageSelectVasPackagePageComponent,
    VasPackageCurrentBalancePageComponent,
    VasPackageLoginWithPinPageComponent,
    VasPackageOtpPageComponent,
    VasPackageResultPageComponent,
    VasPackageSliderComponent,
    VasPackageTabComponent,
    NetworkTypeFilter
  ]
})
export class VasPackageModule { }
