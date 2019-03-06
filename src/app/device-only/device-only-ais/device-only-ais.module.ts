import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceOnlyAisRoutingModule } from './device-only-ais-routing.module';
import { DeviceOnlyAisSelectMobileCarePageComponent } from './contrainers/device-only-ais-select-mobile-care-page/device-only-ais-select-mobile-care-page.component';
import { DeviceOnlyAisMobileCareAvaliablePageComponent } from './contrainers/device-only-ais-mobile-care-avaliable-page/device-only-ais-mobile-care-avaliable-page.component';
import { SelectPaymentAndReceiptInformationPageComponent } from './contrainers/select-payment-and-receipt-information-page/select-payment-and-receipt-information-page.component';

@NgModule({
  imports: [
    CommonModule,
    DeviceOnlyAisRoutingModule
  ],
  declarations: [
    DeviceOnlyAisSelectMobileCarePageComponent,
    DeviceOnlyAisMobileCareAvaliablePageComponent,
    SelectPaymentAndReceiptInformationPageComponent]
})
export class DeviceOnlyAisModule { }
