import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillingAddressComponent } from '../components/billing-address/billing-address.component';
import { ReadCardComponent } from '../components/read-card/read-card.component';
import { ReceiptInformationComponent } from '../components/receipt-information/receipt-information.component';
import { ShoppingCartDetailComponent } from '../components/shopping-cart-detail/shopping-cart-detail.component';
import { SummaryOrderDetailComponent } from '../components/summary-order-detail/summary-order-detail.component';
import { SummaryPaymentDetailComponent } from '../components/summary-payment-detail/summary-payment-detail.component';
import { SummaryProductAndServiceComponent } from '../components/summary-product-and-service/summary-product-and-service.component';
import { SummarySellerCodeComponent } from '../components/summary-seller-code/summary-seller-code.component';
import { MobileCareComponent } from '../components/mobile-care/mobile-care.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MyChannelSharedLibsModule } from 'mychannel-shared-libs';
import { TabsModule } from 'ngx-bootstrap';
import { MobileCareAspComponent } from '../components/mobile-care-asp/mobile-care-asp.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MyChannelSharedLibsModule,
    TabsModule.forRoot(),
    TranslateModule,
  ],
  declarations: [
    BillingAddressComponent,
    ReadCardComponent,
    MobileCareComponent,
    MobileCareAspComponent,
    ReceiptInformationComponent,
    ShoppingCartDetailComponent,
    SummaryOrderDetailComponent,
    SummaryPaymentDetailComponent,
    SummaryProductAndServiceComponent,
    SummarySellerCodeComponent,
  ],
  exports: [
    BillingAddressComponent,
    ReadCardComponent,
    MobileCareComponent,
    MobileCareAspComponent,
    ReceiptInformationComponent,
    ShoppingCartDetailComponent,
    SummaryOrderDetailComponent,
    SummaryPaymentDetailComponent,
    SummaryProductAndServiceComponent,
    SummarySellerCodeComponent
  ],
  providers: []
})
export class DeviceOnlySharedModule { }
