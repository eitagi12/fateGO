import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeviceOrderAspExistingBestBuyValidateCustomerPageComponent } from './containers/device-order-asp-existing-best-buy-validate-customer-page/device-order-asp-existing-best-buy-validate-customer-page.component';
import { DeviceOrderAspExistingBestBuyValidateCustomerIdCardPageComponent } from './containers/device-order-asp-existing-best-buy-validate-customer-id-card-page/device-order-asp-existing-best-buy-validate-customer-id-card-page.component';
import { DeviceOrderAspExistingBestBuyValidateCustomerRepiPageComponent } from './containers/device-order-asp-existing-best-buy-validate-customer-repi-page/device-order-asp-existing-best-buy-validate-customer-repi-page.component';
import { DeviceOrderAspExistingBestBuyValidateCustomerIdCardRepiPageComponent } from './containers/device-order-asp-existing-best-buy-validate-customer-id-card-repi-page/device-order-asp-existing-best-buy-validate-customer-id-card-repi-page.component';
import { DeviceOrderAspExistingBestBuyCustomerInfoPageComponent } from './containers/device-order-asp-existing-best-buy-customer-info-page/device-order-asp-existing-best-buy-customer-info-page.component';
import { DeviceOrderAspExistingBestBuyCustomerProfilePageComponent } from './containers/device-order-asp-existing-best-buy-customer-profile-page/device-order-asp-existing-best-buy-customer-profile-page.component';
import { DeviceOrderAspExistingBestBuyOtpPageComponent } from './containers/device-order-asp-existing-best-buy-otp-page/device-order-asp-existing-best-buy-otp-page.component';
import { DeviceOrderAspExistingBestBuyIdcardCaptureRepiPageComponent } from './containers/device-order-asp-existing-best-buy-idcard-capture-repi-page/device-order-asp-existing-best-buy-idcard-capture-repi-page.component';
import { DeviceOrderAspExistingBestBuyMobileDetailPageComponent } from './containers/device-order-asp-existing-best-buy-mobile-detail-page/device-order-asp-existing-best-buy-mobile-detail-page.component';
import { DeviceOrderAspExistingBestBuyEligibleMobilePageComponent } from './containers/device-order-asp-existing-best-buy-eligible-mobile-page/device-order-asp-existing-best-buy-eligible-mobile-page.component';
import { DeviceOrderAspExistingBestBuyPaymentDetailPageComponent } from './containers/device-order-asp-existing-best-buy-payment-detail-page/device-order-asp-existing-best-buy-payment-detail-page.component';
import { DeviceOrderAspExistingBestBuyMobileCareAvailablePageComponent } from './containers/device-order-asp-existing-best-buy-mobile-care-available-page/device-order-asp-existing-best-buy-mobile-care-available-page.component';
import { DeviceOrderAspExistingBestBuyMobileCarePageComponent } from './containers/device-order-asp-existing-best-buy-mobile-care-page/device-order-asp-existing-best-buy-mobile-care-page.component';
import { DeviceOrderAspExistingBestBuySummaryPageComponent } from './containers/device-order-asp-existing-best-buy-summary-page/device-order-asp-existing-best-buy-summary-page.component';
import { DeviceOrderAspExistingBestBuyQrCodeSummaryPageComponent } from './containers/device-order-asp-existing-best-buy-qr-code-summary-page/device-order-asp-existing-best-buy-qr-code-summary-page.component';
import { DeviceOrderAspExistingBestBuyQrCodePaymentGeneratorPageComponent } from './containers/device-order-asp-existing-best-buy-qr-code-payment-generator-page/device-order-asp-existing-best-buy-qr-code-payment-generator-page.component';
import { DeviceOrderAspExistingBestBuyQrCodeQueuePageComponent } from './containers/device-order-asp-existing-best-buy-qr-code-queue-page/device-order-asp-existing-best-buy-qr-code-queue-page.component';
import { DeviceOrderAspExistingBestBuyCheckOutPageComponent } from './containers/device-order-asp-existing-best-buy-check-out-page/device-order-asp-existing-best-buy-check-out-page.component';
import { DeviceOrderAspExistingBestBuyQueuePageComponent } from './containers/device-order-asp-existing-best-buy-queue-page/device-order-asp-existing-best-buy-queue-page.component';
import { DeviceOrderAspExistingBestBuyResultPageComponent } from './containers/device-order-asp-existing-best-buy-result-page/device-order-asp-existing-best-buy-result-page.component';
import { DeviceOrderAspExistingBestBuyQrCodeQueueSummaryPageComponent } from './containers/device-order-asp-existing-best-buy-qr-code-queue-summary-page/device-order-asp-existing-best-buy-qr-code-queue-summary-page.component';

const routes: Routes = [
    { path: '', redirectTo: 'validate-customer', pathMatch: 'full' },
    { path: 'validate-customer', component: DeviceOrderAspExistingBestBuyValidateCustomerPageComponent },
    { path: 'validate-customer-id-card', component: DeviceOrderAspExistingBestBuyValidateCustomerIdCardPageComponent},
    { path: 'validate-customer-repi', component: DeviceOrderAspExistingBestBuyValidateCustomerRepiPageComponent},
    { path: 'validate-customer-id-card-repi', component: DeviceOrderAspExistingBestBuyValidateCustomerIdCardRepiPageComponent},
    { path: 'customer-info', component: DeviceOrderAspExistingBestBuyCustomerInfoPageComponent },
    { path: 'customer-profile', component: DeviceOrderAspExistingBestBuyCustomerProfilePageComponent },
    { path: 'otp', component: DeviceOrderAspExistingBestBuyOtpPageComponent },
    { path: 'id-card-capture-repi', component: DeviceOrderAspExistingBestBuyIdcardCaptureRepiPageComponent },
    { path: 'mobile-detail', component: DeviceOrderAspExistingBestBuyMobileDetailPageComponent },
    { path: 'eligible-mobile', component: DeviceOrderAspExistingBestBuyEligibleMobilePageComponent },
    { path: 'payment-detail', component: DeviceOrderAspExistingBestBuyPaymentDetailPageComponent },
    { path: 'mobile-care-available', component: DeviceOrderAspExistingBestBuyMobileCareAvailablePageComponent },
    { path: 'mobile-care', component: DeviceOrderAspExistingBestBuyMobileCarePageComponent },
    { path: 'summary', component: DeviceOrderAspExistingBestBuySummaryPageComponent },
    { path: 'qr-code-summary', component:  DeviceOrderAspExistingBestBuyQrCodeSummaryPageComponent },
    { path: 'qr-code-generator', component:  DeviceOrderAspExistingBestBuyQrCodePaymentGeneratorPageComponent },
    { path: 'qr-code-queue', component:  DeviceOrderAspExistingBestBuyQrCodeQueuePageComponent },
    { path: 'check-out', component: DeviceOrderAspExistingBestBuyCheckOutPageComponent },
    { path: 'queue', component: DeviceOrderAspExistingBestBuyQueuePageComponent},
    { path: 'result', component: DeviceOrderAspExistingBestBuyResultPageComponent },
    { path: 'qr-code-queue-summary', component: DeviceOrderAspExistingBestBuyQrCodeQueueSummaryPageComponent }
  ];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class DeviceOrderAspExistingBestBuyRoutingModule { }
