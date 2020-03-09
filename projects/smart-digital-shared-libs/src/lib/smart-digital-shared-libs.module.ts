import { NgModule } from '@angular/core';
import { SmartDigitalSharedLibsComponent } from './smart-digital-shared-libs.component';
import { CommonModule } from '@angular/common';
import { MyChannelSharedLibsModule } from 'mychannel-shared-libs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PromotionShelveComponent } from './components/promotion-shelve/promotion-shelve.component';
import { TabsModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    MyChannelSharedLibsModule,
    FormsModule,
    ReactiveFormsModule,
    TabsModule.forRoot(),
  ],
  declarations: [
    SmartDigitalSharedLibsComponent,
    PromotionShelveComponent
  ],
  exports: [
    SmartDigitalSharedLibsComponent,
    PromotionShelveComponent
  ]
})
export class SmartDigitalSharedLibsModule { }
