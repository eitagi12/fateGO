import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { IdCardPipe } from 'mychannel-shared-libs';
import { TranslateModule } from '@ngx-translate/core';

import { DeviceOrderRoutingModule } from './device-order-routing.module';
import { DeviceOrderComponent } from './device-order.component';
import { PromotionShelveService } from './services/promotion-shelve.service';
import { MobileCareService } from './services/mobile-care.service';
import { ShoppingCartService } from './services/shopping-cart.service';
import { PrivilegeService } from './services/privilege.service';
import { CustomerInfoService } from './services/customer-info.service';
import { QueuePageService } from './services/queue-page.service';
import { QrCodePageService } from './services/qr-code-page.service';
import { SummaryPageService } from './services/summary-page.service';
import { QrCodeOmisePageService } from 'src/app/device-order/services/qr-code-omise-page.service';

@NgModule({
  imports: [
    CommonModule,
    DeviceOrderRoutingModule,
    TranslateModule
  ],
  providers: [
    PromotionShelveService,
    MobileCareService,
    ShoppingCartService,
    PrivilegeService,
    CustomerInfoService,
    QueuePageService,
    QrCodePageService,
    SummaryPageService,
    IdCardPipe,
    DecimalPipe,
    QrCodeOmisePageService
  ],
  declarations: [
    DeviceOrderComponent
  ]
})
export class DeviceOrderModule { }
