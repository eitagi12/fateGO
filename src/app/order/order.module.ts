import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { I18nService } from 'mychannel-shared-libs';

@NgModule({
  imports: [
    CommonModule,
    OrderRoutingModule,
    TranslateModule
  ],
  providers: [
    I18nService
  ],
  declarations: []
})
export class OrderModule { }
