import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyChannelSharedLibsModule} from 'mychannel-shared-libs';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RomTransactionRoutingModule } from './rom-transaction-routing.module';
import { RomTransactionListMobilePageComponent } from './containers/rom-transaction-list-mobile-page/rom-transaction-list-mobile-page.component';
import { RomTransactionShowInformationPageComponent } from './containers/rom-transaction-show-information-page/rom-transaction-show-information-page.component';
import { RomTransactionResultPageComponent } from './containers/rom-transaction-result-page/rom-transaction-result-page.component';

@NgModule({
  imports: [
    CommonModule,
    RomTransactionRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MyChannelSharedLibsModule,
    TranslateModule
  ],
  declarations: [
    RomTransactionListMobilePageComponent,
    RomTransactionResultPageComponent,
    RomTransactionShowInformationPageComponent]
})
export class RomTransactionModule { }
