import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeviceOrderAisExistingBestBuyValidateCustomerPageComponent } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/containers/device-order-ais-existing-best-buy-validate-customer-page/device-order-ais-existing-best-buy-validate-customer-page.component';
import { DeviceOrderAisExistingBestBuyValidateCustomerIdCardPageComponent } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/containers/device-order-ais-existing-best-buy-validate-customer-id-card-page/device-order-ais-existing-best-buy-validate-customer-id-card-page.component';
import { DeviceOrderAisExistingBestBuyValidateCustomerKeyInPageComponent } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/containers/device-order-ais-existing-best-buy-validate-customer-key-in-page/device-order-ais-existing-best-buy-validate-customer-key-in-page.component';
import { DeviceOrderAisExistingBestBuyCustomerInfoPageComponent } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/containers/device-order-ais-existing-best-buy-customer-info-page/device-order-ais-existing-best-buy-customer-info-page.component';
import { DeviceOrderAisExistingBestBuyMobileDetailPageComponent } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/containers/device-order-ais-existing-best-buy-mobile-detail-page/device-order-ais-existing-best-buy-mobile-detail-page.component';
import { DeviceOrderAisExistingBestBuyEligibleMobilePageComponent } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/containers/device-order-ais-existing-best-buy-eligible-mobile-page/device-order-ais-existing-best-buy-eligible-mobile-page.component';
import { DeviceOrderAisExistingBestBuyPaymentDetailPageComponent } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/containers/device-order-ais-existing-best-buy-payment-detail-page/device-order-ais-existing-best-buy-payment-detail-page.component';
import { DeviceOrderAisExistingBestBuyMobileCareAvailablePageComponent } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/containers/device-order-ais-existing-best-buy-mobile-care-available-page/device-order-ais-existing-best-buy-mobile-care-available-page.component';
import { DeviceOrderAisExistingBestBuyMobileCarePageComponent } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/containers/device-order-ais-existing-best-buy-mobile-care-page/device-order-ais-existing-best-buy-mobile-care-page.component';
import { DeviceOrderAisExistingBestBuySummaryPageComponent } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/containers/device-order-ais-existing-best-buy-summary-page/device-order-ais-existing-best-buy-summary-page.component';
import { DeviceOrderAisExistingBestBuyCheckOutPageComponent } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/containers/device-order-ais-existing-best-buy-check-out-page/device-order-ais-existing-best-buy-check-out-page.component';
import { DeviceOrderAisExistingBestBuyQueuePageComponent } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/containers/device-order-ais-existing-best-buy-queue-page/device-order-ais-existing-best-buy-queue-page.component';
import { DeviceOrderAisExistingBestBuyResultPageComponent } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/containers/device-order-ais-existing-best-buy-result-page/device-order-ais-existing-best-buy-result-page.component';
import { DeviceOrderAisExistingBestBuyQrCodePaymentGeneratorPageComponent } from './containers/device-order-ais-existing-best-buy-qr-code-payment-generator-page/device-order-ais-existing-best-buy-qr-code-payment-generator-page.component';
import { DeviceOrderAisExistingBestBuyQrCodeSummaryPageComponent } from './containers/device-order-ais-existing-best-buy-qr-code-summary-page/device-order-ais-existing-best-buy-qr-code-summary-page.component';

const routes: Routes = [
  // { path: '', redirectTo: 'validate-customer', pathMatch: 'full' },
  { path: 'validate-customer', component: DeviceOrderAisExistingBestBuyValidateCustomerPageComponent },
  { path: 'validate-customer-id-card', component: DeviceOrderAisExistingBestBuyValidateCustomerIdCardPageComponent},
  { path: 'validate-customer-key-in', component: DeviceOrderAisExistingBestBuyValidateCustomerKeyInPageComponent },
  { path: 'customer-info', component: DeviceOrderAisExistingBestBuyCustomerInfoPageComponent },
  { path: 'mobile-detail', component: DeviceOrderAisExistingBestBuyMobileDetailPageComponent },
  { path: 'eligible-mobile', component: DeviceOrderAisExistingBestBuyEligibleMobilePageComponent },
  { path: 'payment-detail', component: DeviceOrderAisExistingBestBuyPaymentDetailPageComponent },
  { path: 'mobile-care-available', component: DeviceOrderAisExistingBestBuyMobileCareAvailablePageComponent },
  { path: 'mobile-care', component: DeviceOrderAisExistingBestBuyMobileCarePageComponent },
  { path: 'summary', component: DeviceOrderAisExistingBestBuySummaryPageComponent },
  { path: 'qrcodesummary', component:  DeviceOrderAisExistingBestBuyQrCodeSummaryPageComponent},
  { path: 'qrcode', component:  DeviceOrderAisExistingBestBuyQrCodePaymentGeneratorPageComponent},
  { path: 'check-out', component: DeviceOrderAisExistingBestBuyCheckOutPageComponent },
  { path: 'queue', component: DeviceOrderAisExistingBestBuyQueuePageComponent},
  { path: 'result', component: DeviceOrderAisExistingBestBuyResultPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceOrderAisExistingBestBuyRoutingModule { }
