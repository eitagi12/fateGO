import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    OrderRoutingModule,
    TranslateModule.forRoot()
  ],
  declarations: []
})
export class OrderModule { }
