import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyChannelSharedLibsModule } from 'mychannel-shared-libs';
import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { DeviceOrderAisExistingBestBuyShopRoutingModule } from './device-order-ais-existing-best-buy-shop-routing.module';
import { DeviceOrderAisExistingBestBuyShopCheckOutPageComponent } from './containers/device-order-ais-existing-best-buy-shop-check-out-page/device-order-ais-existing-best-buy-shop-check-out-page.component';
import { DeviceOrderAisExistingBestBuyShopCustomerInfoPageComponent } from './containers/device-order-ais-existing-best-buy-shop-customer-info-page/device-order-ais-existing-best-buy-shop-customer-info-page.component';
import { DeviceOrderAisExistingBestBuyShopCustomerProfilePageComponent } from './containers/device-order-ais-existing-best-buy-shop-customer-profile-page/device-order-ais-existing-best-buy-shop-customer-profile-page.component';
import { DeviceOrderAisExistingBestBuyShopEligibleMobilePageComponent } from './containers/device-order-ais-existing-best-buy-shop-eligible-mobile-page/device-order-ais-existing-best-buy-shop-eligible-mobile-page.component';
import { DeviceOrderAisExistingBestBuyShopIdcardCaptureRepiPageComponent } from './containers/device-order-ais-existing-best-buy-shop-idcard-capture-repi-page/device-order-ais-existing-best-buy-shop-idcard-capture-repi-page.component';
import { DeviceOrderAisExistingBestBuyShopMobileCareAvailablePageComponent } from './containers/device-order-ais-existing-best-buy-shop-mobile-care-available-page/device-order-ais-existing-best-buy-shop-mobile-care-available-page.component';
import { DeviceOrderAisExistingBestBuyShopMobileCarePageComponent } from './containers/device-order-ais-existing-best-buy-shop-mobile-care-page/device-order-ais-existing-best-buy-shop-mobile-care-page.component';
import { DeviceOrderAisExistingBestBuyShopMobileDetailPageComponent } from './containers/device-order-ais-existing-best-buy-shop-mobile-detail-page/device-order-ais-existing-best-buy-shop-mobile-detail-page.component';
import { DeviceOrderAisExistingBestBuyShopOtpPageComponent } from './containers/device-order-ais-existing-best-buy-shop-otp-page/device-order-ais-existing-best-buy-shop-otp-page.component';
import { DeviceOrderAisExistingBestBuyShopPaymentDetailPageComponent } from './containers/device-order-ais-existing-best-buy-shop-payment-detail-page/device-order-ais-existing-best-buy-shop-payment-detail-page.component';
import { DeviceOrderAisExistingBestBuyShopQrCodePaymentGeneratorPageComponent } from './containers/device-order-ais-existing-best-buy-shop-qr-code-payment-generator-page/device-order-ais-existing-best-buy-shop-qr-code-payment-generator-page.component';
import { DeviceOrderAisExistingBestBuyShopQrCodeQueuePageComponent } from './containers/device-order-ais-existing-best-buy-shop-qr-code-queue-page/device-order-ais-existing-best-buy-shop-qr-code-queue-page.component';
import { DeviceOrderAisExistingBestBuyShopQrCodeSummaryPageComponent } from './containers/device-order-ais-existing-best-buy-shop-qr-code-summary-page/device-order-ais-existing-best-buy-shop-qr-code-summary-page.component';
import { DeviceOrderAisExistingBestBuyShopQueuePageComponent } from './containers/device-order-ais-existing-best-buy-shop-queue-page/device-order-ais-existing-best-buy-shop-queue-page.component';
import { DeviceOrderAisExistingBestBuyShopResultPageComponent } from './containers/device-order-ais-existing-best-buy-shop-result-page/device-order-ais-existing-best-buy-shop-result-page.component';
import { DeviceOrderAisExistingBestBuyShopSummaryPageComponent } from './containers/device-order-ais-existing-best-buy-shop-summary-page/device-order-ais-existing-best-buy-shop-summary-page.component';
import { DeviceOrderAisExistingBestBuyShopValidateCustomerIdCardPageComponent } from './containers/device-order-ais-existing-best-buy-shop-validate-customer-id-card-page/device-order-ais-existing-best-buy-shop-validate-customer-id-card-page.component';
import { DeviceOrderAisExistingBestBuyShopValidateCustomerIdCardRepiPageComponent } from './containers/device-order-ais-existing-best-buy-shop-validate-customer-id-card-repi-page/device-order-ais-existing-best-buy-shop-validate-customer-id-card-repi-page.component';
import { DeviceOrderAisExistingBestBuyShopValidateCustomerPageComponent } from './containers/device-order-ais-existing-best-buy-shop-validate-customer-page/device-order-ais-existing-best-buy-shop-validate-customer-page.component';
import { DeviceOrderAisExistingBestBuyShopValidateCustomerRepiPageComponent } from './containers/device-order-ais-existing-best-buy-shop-validate-customer-repi-page/device-order-ais-existing-best-buy-shop-validate-customer-repi-page.component';
import { DeviceOrderAisExistingBestBuyShopOmiseGeneratorPageComponent } from './containers/device-order-ais-existing-best-buy-shop-omise-generator-page/device-order-ais-existing-best-buy-shop-omise-generator-page.component';
import { DeviceOrderAisExistingBestBuyShopOmiseQueuePageComponent } from './containers/device-order-ais-existing-best-buy-shop-omise-queue-page/device-order-ais-existing-best-buy-shop-omise-queue-page.component';
import { DeviceOrderAisExistingBestBuyShopOmiseResultPageComponent } from './containers/device-order-ais-existing-best-buy-shop-omise-result-page/device-order-ais-existing-best-buy-shop-omise-result-page.component';
import { DeviceOrderAisExistingBestBuyShopOmiseSummaryPageComponent } from './containers/device-order-ais-existing-best-buy-shop-omise-summary-page/device-order-ais-existing-best-buy-shop-omise-summary-page.component';

@NgModule({
  imports: [
    CommonModule,
    DeviceOrderAisExistingBestBuyShopRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MyChannelSharedLibsModule,
    TabsModule.forRoot(),
    TranslateModule
  ],
  declarations: [
    DeviceOrderAisExistingBestBuyShopCheckOutPageComponent,
    DeviceOrderAisExistingBestBuyShopCustomerInfoPageComponent,
    DeviceOrderAisExistingBestBuyShopCustomerProfilePageComponent,
    DeviceOrderAisExistingBestBuyShopEligibleMobilePageComponent,
    DeviceOrderAisExistingBestBuyShopIdcardCaptureRepiPageComponent,
    DeviceOrderAisExistingBestBuyShopMobileCareAvailablePageComponent,
    DeviceOrderAisExistingBestBuyShopMobileCarePageComponent,
    DeviceOrderAisExistingBestBuyShopMobileDetailPageComponent,
    DeviceOrderAisExistingBestBuyShopOtpPageComponent,
    DeviceOrderAisExistingBestBuyShopPaymentDetailPageComponent,
    DeviceOrderAisExistingBestBuyShopQrCodePaymentGeneratorPageComponent,
    DeviceOrderAisExistingBestBuyShopQrCodeQueuePageComponent,
    DeviceOrderAisExistingBestBuyShopQrCodeSummaryPageComponent,
    DeviceOrderAisExistingBestBuyShopQueuePageComponent,
    DeviceOrderAisExistingBestBuyShopResultPageComponent,
    DeviceOrderAisExistingBestBuyShopSummaryPageComponent,
    DeviceOrderAisExistingBestBuyShopValidateCustomerIdCardPageComponent,
    DeviceOrderAisExistingBestBuyShopValidateCustomerIdCardRepiPageComponent,
    DeviceOrderAisExistingBestBuyShopValidateCustomerPageComponent,
    DeviceOrderAisExistingBestBuyShopValidateCustomerRepiPageComponent,
    DeviceOrderAisExistingBestBuyShopOmiseGeneratorPageComponent,
    DeviceOrderAisExistingBestBuyShopOmiseQueuePageComponent,
    DeviceOrderAisExistingBestBuyShopOmiseResultPageComponent,
    DeviceOrderAisExistingBestBuyShopOmiseSummaryPageComponent
  ],
  providers: []
})
export class DeviceOrderAisExistingBestBuyShopModule { }
