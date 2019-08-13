import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceOnlyKioskRoutingModule } from './device-only-kiosk-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MyChannelSharedLibsModule } from 'mychannel-shared-libs';
import { TabsModule} from 'ngx-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
// containers
import { DeviceOnlyKioskCheckoutPaymentPageComponent } from './containers/device-only-kiosk-checkout-payment-page/device-only-kiosk-checkout-payment-page.component';
import { DeviceOnlyKioskCheckoutPaymentQrCodePageComponent } from './containers/device-only-kiosk-checkout-payment-qr-code-page/device-only-kiosk-checkout-payment-qr-code-page.component';
import { DeviceOnlyKioskQrCodeGenaratePageComponent } from './containers/device-only-kiosk-qr-code-genarate-page/device-only-kiosk-qr-code-genarate-page.component';
import { DeviceOnlyKioskQrCodeQueuePageComponent } from './containers/device-only-kiosk-qr-code-queue-page/device-only-kiosk-qr-code-queue-page.component';
import { DeviceOnlyKioskResultQueuePageComponent } from './containers/device-only-kiosk-result-queue-page/device-only-kiosk-result-queue-page.component';
import { DeviceOnlyKioskSelectMobileCarePageComponent } from './containers/device-only-kiosk-select-mobile-care-page/device-only-kiosk-select-mobile-care-page.component';
import { DeviceOnlyKioskSelectPaymentAndReceiptInformationPageComponent } from './containers/device-only-kiosk-select-payment-and-receipt-information-page/device-only-kiosk-select-payment-and-receipt-information-page.component';
import { DeviceOnlyKioskSummaryPageComponent } from './containers/device-only-kiosk-summary-page/device-only-kiosk-summary-page.component';
import { DeviceOnlyKioskQrCodeSummaryPageComponent } from './containers/device-only-kiosk-qr-code-summary-page/device-only-kiosk-qr-code-summary-page.component';
import { DeviceOnlyKioskQueuePageComponent } from './containers/device-only-kiosk-queue-page/device-only-kiosk-queue-page.component';
import { DeviceOnlySharedModule } from '../../shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TabsModule.forRoot(),
    TranslateModule,
    DeviceOnlyKioskRoutingModule,
    MyChannelSharedLibsModule,
    DeviceOnlySharedModule
  ],
  declarations: [
    DeviceOnlyKioskCheckoutPaymentPageComponent,
    DeviceOnlyKioskCheckoutPaymentQrCodePageComponent,
    DeviceOnlyKioskQrCodeGenaratePageComponent,
    DeviceOnlyKioskQrCodeQueuePageComponent,
    DeviceOnlyKioskResultQueuePageComponent,
    DeviceOnlyKioskSelectMobileCarePageComponent,
    DeviceOnlyKioskSelectPaymentAndReceiptInformationPageComponent,
    DeviceOnlyKioskSummaryPageComponent,
    DeviceOnlyKioskQrCodeSummaryPageComponent,
    DeviceOnlyKioskQueuePageComponent
  ],
  providers: []

})
export class DeviceOnlyKioskModule { }
