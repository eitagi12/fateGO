import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceOnlyAspRoutingModule } from './device-only-asp-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MyChannelSharedLibsModule } from 'mychannel-shared-libs';
import { TabsModule} from 'ngx-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { DeviceOnlySharedModule } from '../../shared/shared.module';
// containers
import { DeviceOnlyAspSelectMobileCarePageComponent } from './containers/device-only-asp-select-mobile-care-page/device-only-asp-select-mobile-care-page.component';
import { DeviceOnlyAspSummaryPageComponent } from './containers/device-only-asp-summary-page/device-only-asp-summary-page.component';
import { DeviceOnlyAspReadCardPageComponent } from './containers/device-only-asp-read-card-page/device-only-asp-read-card-page.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TabsModule.forRoot(),
    TranslateModule,
    DeviceOnlyAspRoutingModule,
    MyChannelSharedLibsModule,
    DeviceOnlySharedModule
  ],
  declarations: [
    DeviceOnlyAspSelectMobileCarePageComponent,
    DeviceOnlyAspSummaryPageComponent,
    DeviceOnlyAspReadCardPageComponent
  ],
  providers: []
})
export class DeviceOnlyAspModule { }
