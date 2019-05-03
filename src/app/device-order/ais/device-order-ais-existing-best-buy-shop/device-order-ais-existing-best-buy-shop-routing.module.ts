import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeviceOrderAisExistingBestBuyShopValidateCustomerPageComponent } from './containers/device-order-ais-existing-best-buy-shop-validate-customer-page/device-order-ais-existing-best-buy-shop-validate-customer-page.component';
import { DeviceOrderAisExistingBestBuyShopValidateCustomerIdCardPageComponent } from './containers/device-order-ais-existing-best-buy-shop-validate-customer-id-card-page/device-order-ais-existing-best-buy-shop-validate-customer-id-card-page.component';
import { DeviceOrderAisExistingBestBuyShopValidateCustomerRepiPageComponent } from './containers/device-order-ais-existing-best-buy-shop-validate-customer-repi-page/device-order-ais-existing-best-buy-shop-validate-customer-repi-page.component';
import { DeviceOrderAisExistingBestBuyShopValidateCustomerIdCardRepiPageComponent } from './containers/device-order-ais-existing-best-buy-shop-validate-customer-id-card-repi-page/device-order-ais-existing-best-buy-shop-validate-customer-id-card-repi-page.component';
import { DeviceOrderAisExistingBestBuyShopCustomerInfoPageComponent } from './containers/device-order-ais-existing-best-buy-shop-customer-info-page/device-order-ais-existing-best-buy-shop-customer-info-page.component';
import { DeviceOrderAisExistingBestBuyShopCustomerProfilePageComponent } from './containers/device-order-ais-existing-best-buy-shop-customer-profile-page/device-order-ais-existing-best-buy-shop-customer-profile-page.component';
import { DeviceOrderAisExistingBestBuyShopOtpPageComponent } from './containers/device-order-ais-existing-best-buy-shop-otp-page/device-order-ais-existing-best-buy-shop-otp-page.component';
import { DeviceOrderAisExistingBestBuyShopIdcardCaptureRepiPageComponent } from './containers/device-order-ais-existing-best-buy-shop-idcard-capture-repi-page/device-order-ais-existing-best-buy-shop-idcard-capture-repi-page.component';
import { DeviceOrderAisExistingBestBuyShopMobileDetailPageComponent } from './containers/device-order-ais-existing-best-buy-shop-mobile-detail-page/device-order-ais-existing-best-buy-shop-mobile-detail-page.component';
import { DeviceOrderAisExistingBestBuyShopEligibleMobilePageComponent } from './containers/device-order-ais-existing-best-buy-shop-eligible-mobile-page/device-order-ais-existing-best-buy-shop-eligible-mobile-page.component';
import { DeviceOrderAisExistingBestBuyShopPaymentDetailPageComponent } from './containers/device-order-ais-existing-best-buy-shop-payment-detail-page/device-order-ais-existing-best-buy-shop-payment-detail-page.component';
import { DeviceOrderAisExistingBestBuyShopMobileCareAvailablePageComponent } from './containers/device-order-ais-existing-best-buy-shop-mobile-care-available-page/device-order-ais-existing-best-buy-shop-mobile-care-available-page.component';
import { DeviceOrderAisExistingBestBuyShopMobileCarePageComponent } from './containers/device-order-ais-existing-best-buy-shop-mobile-care-page/device-order-ais-existing-best-buy-shop-mobile-care-page.component';
import { DeviceOrderAisExistingBestBuyShopSummaryPageComponent } from './containers/device-order-ais-existing-best-buy-shop-summary-page/device-order-ais-existing-best-buy-shop-summary-page.component';
import { DeviceOrderAisExistingBestBuyShopQrCodeSummaryPageComponent } from './containers/device-order-ais-existing-best-buy-shop-qr-code-summary-page/device-order-ais-existing-best-buy-shop-qr-code-summary-page.component';
import { DeviceOrderAisExistingBestBuyShopQrCodePaymentGeneratorPageComponent } from './containers/device-order-ais-existing-best-buy-shop-qr-code-payment-generator-page/device-order-ais-existing-best-buy-shop-qr-code-payment-generator-page.component';
import { DeviceOrderAisExistingBestBuyShopQrCodeQueuePageComponent } from './containers/device-order-ais-existing-best-buy-shop-qr-code-queue-page/device-order-ais-existing-best-buy-shop-qr-code-queue-page.component';
import { DeviceOrderAisExistingBestBuyShopCheckOutPageComponent } from './containers/device-order-ais-existing-best-buy-shop-check-out-page/device-order-ais-existing-best-buy-shop-check-out-page.component';
import { DeviceOrderAisExistingBestBuyShopQueuePageComponent } from './containers/device-order-ais-existing-best-buy-shop-queue-page/device-order-ais-existing-best-buy-shop-queue-page.component';
import { DeviceOrderAisExistingBestBuyShopResultPageComponent } from './containers/device-order-ais-existing-best-buy-shop-result-page/device-order-ais-existing-best-buy-shop-result-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'validate-customer', pathMatch: 'full' },
  { path: 'validate-customer', component: DeviceOrderAisExistingBestBuyShopValidateCustomerPageComponent },
  { path: 'validate-customer-id-card', component: DeviceOrderAisExistingBestBuyShopValidateCustomerIdCardPageComponent},
  { path: 'validate-customer-repi', component: DeviceOrderAisExistingBestBuyShopValidateCustomerRepiPageComponent},
  { path: 'validate-customer-id-card-repi', component: DeviceOrderAisExistingBestBuyShopValidateCustomerIdCardRepiPageComponent},
  { path: 'customer-info', component: DeviceOrderAisExistingBestBuyShopCustomerInfoPageComponent },
  { path: 'customer-profile', component: DeviceOrderAisExistingBestBuyShopCustomerProfilePageComponent },
  { path: 'otp', component: DeviceOrderAisExistingBestBuyShopOtpPageComponent },
  { path: 'id-card-capture-repi', component: DeviceOrderAisExistingBestBuyShopIdcardCaptureRepiPageComponent },
  { path: 'mobile-detail', component: DeviceOrderAisExistingBestBuyShopMobileDetailPageComponent },
  { path: 'eligible-mobile', component: DeviceOrderAisExistingBestBuyShopEligibleMobilePageComponent },
  { path: 'payment-detail', component: DeviceOrderAisExistingBestBuyShopPaymentDetailPageComponent },
  { path: 'mobile-care-available', component: DeviceOrderAisExistingBestBuyShopMobileCareAvailablePageComponent },
  { path: 'mobile-care', component: DeviceOrderAisExistingBestBuyShopMobileCarePageComponent },
  { path: 'summary', component: DeviceOrderAisExistingBestBuyShopSummaryPageComponent },
  { path: 'qr-code-summary', component:  DeviceOrderAisExistingBestBuyShopQrCodeSummaryPageComponent },
  { path: 'qr-code-generator', component:  DeviceOrderAisExistingBestBuyShopQrCodePaymentGeneratorPageComponent },
  { path: 'qr-code-queue', component:  DeviceOrderAisExistingBestBuyShopQrCodeQueuePageComponent },
  { path: 'check-out', component: DeviceOrderAisExistingBestBuyShopCheckOutPageComponent },
  { path: 'queue', component: DeviceOrderAisExistingBestBuyShopQueuePageComponent},
  { path: 'result', component: DeviceOrderAisExistingBestBuyShopResultPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceOrderAisExistingBestBuyShopRoutingModule { }
