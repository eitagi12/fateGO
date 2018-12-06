import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderMnpNetworkTypePageComponent } from './containers/order-mnp-network-type-page/order-mnp-network-type-page.component';
import { OrderMnpSelectReasonPageComponent } from './containers/order-mnp-select-reason-page/order-mnp-select-reason-page.component';
import { OrderMnpValidateCustomerPageComponent } from './containers/order-mnp-validate-customer-page/order-mnp-validate-customer-page.component';
import { OrderMnpValidateCustomerIdCardPageComponent } from './containers/order-mnp-validate-customer-id-card-page/order-mnp-validate-customer-id-card-page.component';
import { OrderMnpValidateCustomerKeyInPageComponent } from './containers/order-mnp-validate-customer-key-in-page/order-mnp-validate-customer-key-in-page.component';
import { OrderMnpIdCardCapturePageComponent } from './containers/order-mnp-id-card-capture-page/order-mnp-id-card-capture-page.component';
import { OrderMnpCustomerInfoPageComponent } from './containers/order-mnp-customer-info-page/order-mnp-customer-info-page.component';
import { OrderMnpSelectPackagePageComponent } from './containers/order-mnp-select-package-page/order-mnp-select-package-page.component';
import { OrderMnpConfirmUserInformationPageComponent } from './containers/order-mnp-confirm-user-information-page/order-mnp-confirm-user-information-page.component';
import { OrderMnpEbillingAddressPageComponent } from './containers/order-mnp-ebilling-address-page/order-mnp-ebilling-address-page.component';
import { OrderMnpMergeBillingPageComponent } from './containers/order-mnp-merge-billing-page/order-mnp-merge-billing-page.component';
import { OrderMnpSummaryPageComponent } from './containers/order-mnp-summary-page/order-mnp-summary-page.component';
import { OrderMnpAgreementSignPageComponent } from './containers/order-mnp-agreement-sign-page/order-mnp-agreement-sign-page.component';
import { OrderMnpPersoSimPageComponent } from './containers/order-mnp-perso-sim-page/order-mnp-perso-sim-page.component';
import { OrderMnpResultPageComponent } from './containers/order-mnp-result-page/order-mnp-result-page.component';
import { OrderMnpOnTopPageComponent } from './containers/order-mnp-on-top-page/order-mnp-on-top-page.component';
import { OrderMnpOneLovePageComponent } from './containers/order-mnp-one-love-page/order-mnp-one-love-page.component';
import { OrderMnpEbillingPageComponent } from './containers/order-mnp-ebilling-page/order-mnp-ebilling-page.component';
import { OrderMnpEapplicationPageComponent } from './containers/order-mnp-eapplication-page/order-mnp-eapplication-page.component';


const routes: Routes = [
  { path: '', redirectTo: 'networt-type', pathMatch: 'full' },
  { path: 'networt-type', component: OrderMnpNetworkTypePageComponent },
  { path: 'select-reason', component: OrderMnpSelectReasonPageComponent },
  { path: 'validate-customer', component: OrderMnpValidateCustomerPageComponent },
  { path: 'validate-customer-id-card', component: OrderMnpValidateCustomerIdCardPageComponent },
  { path: 'validate-customer-key-in', component: OrderMnpValidateCustomerKeyInPageComponent },
  { path: 'id-card-capture', component: OrderMnpIdCardCapturePageComponent },
  { path: 'customer-info', component: OrderMnpCustomerInfoPageComponent },
  { path: 'select-package', component: OrderMnpSelectPackagePageComponent },
  { path: 'confirm-user-information', component: OrderMnpConfirmUserInformationPageComponent },
  { path: 'ebilling-address', component: OrderMnpEbillingAddressPageComponent },
  { path: 'merge-billing', component: OrderMnpMergeBillingPageComponent },
  { path: 'summary', component: OrderMnpSummaryPageComponent },
  { path: 'agreement-sign', component: OrderMnpAgreementSignPageComponent },
  { path: 'perso-sim', component: OrderMnpPersoSimPageComponent },
  { path: 'on-top', component: OrderMnpOnTopPageComponent },
  { path: 'result', component: OrderMnpResultPageComponent },
  { path: 'one-love', component: OrderMnpOneLovePageComponent },
  { path: 'ebilling' , component:  OrderMnpEbillingPageComponent},
  { path: 'eapplication', component: OrderMnpEapplicationPageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderMnpRoutingModule { }
