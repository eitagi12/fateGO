import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceOnlyRoutingModule } from './device-only-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MyChannelSharedLibsModule } from 'mychannel-shared-libs';
import { SharedModule } from '../shared/shared.module';
// service
import { BillingAddressService } from 'src/app/device-only/services/billing-address.service';
import { CreateOrderService } from 'src/app/device-only/services/create-order.service';
import { CustomerInformationService } from 'src/app/device-only/services/customer-information.service';
import { HomeButtonService } from 'src/app/device-only/services/home-button.service';
import { MobileCareService } from 'src/app/device-only/services/mobile-care.service';
import { QueueService } from 'src/app/device-only/services/queue.service';
import { SellerService } from 'src/app/device-only/services/seller.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TabsModule.forRoot(),
    TranslateModule,
    DeviceOnlyRoutingModule,
    MyChannelSharedLibsModule,
    SharedModule
  ],
  providers: [
    BillingAddressService,
    CreateOrderService,
    CustomerInformationService,
    HomeButtonService,
    MobileCareService,
    QueueService,
    SellerService
  ]
})
export class DeviceOnlyModule { }
