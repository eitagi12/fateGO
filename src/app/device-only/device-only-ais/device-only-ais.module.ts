import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceOnlyAisSelectPaymentComponent } from './contrainers/device-only-ais-select-payment/device-only-ais-select-payment.component';
import { DeviceOnlyAisRoutingModule } from './device-only-ais-routing.module';
import { DeviceOnlyAisSelectMobileCarePageComponent } from './contrainers/device-only-ais-select-mobile-care-page/device-only-ais-select-mobile-care-page.component';
import { DeviceOnlyAisMobileCareAvaliablePageComponent } from './contrainers/device-only-ais-mobile-care-avaliable-page/device-only-ais-mobile-care-avaliable-page.component';

@NgModule({
  imports: [
    CommonModule,
    DeviceOnlyAisRoutingModule
  ],
  declarations: [DeviceOnlyAisSelectPaymentComponent, DeviceOnlyAisSelectMobileCarePageComponent, DeviceOnlyAisMobileCareAvaliablePageComponent]
})
export class DeviceOnlyAisModule { }
