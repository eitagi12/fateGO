import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceOnlyAspRoutingModule } from './device-only-asp-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MyChannelSharedLibsModule } from 'mychannel-shared-libs';
import { TabsModule} from 'ngx-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { DeviceOnlySharedModule } from '../../shared/shared.module';
// containers
import { DeviceOnlyAspSelectPaymentAndReceiptInformationPageComponent } from './containers/device-only-asp-select-payment-and-receipt-information-page/device-only-asp-select-payment-and-receipt-information-page.component';
import { DeviceOnlyAspSelectMobileCarePageComponent } from './containers/device-only-asp-select-mobile-care-page/device-only-asp-select-mobile-care-page.component';
import { DeviceOnlyAspQueuePageComponent } from './containers/device-only-asp-queue-page/device-only-asp-queue-page.component';
import { DeviceOnlyAspCheckoutPaymentPageComponent } from './containers/device-only-asp-checkout-payment-page/device-only-asp-checkout-payment-page.component';
import { DeviceOnlyAspSummaryPageComponent } from './containers/device-only-asp-summary-page/device-only-asp-summary-page.component';
import { DeviceOnlyAspResultQueuePageComponent } from './containers/device-only-asp-result-queue-page/device-only-asp-result-queue-page.component';
import { DeviceOnlyAspReadCardComponent } from './containers/device-only-asp-read-card/device-only-asp-read-card.component';
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
    DeviceOnlyAspSelectPaymentAndReceiptInformationPageComponent,
    DeviceOnlyAspSelectMobileCarePageComponent,
    DeviceOnlyAspQueuePageComponent,
    DeviceOnlyAspCheckoutPaymentPageComponent,
    DeviceOnlyAspSummaryPageComponent,
    DeviceOnlyAspResultQueuePageComponent,
    DeviceOnlyAspReadCardComponent
  ],
  providers: []
})
export class DeviceOnlyAspModule { }
