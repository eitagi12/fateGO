import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OmniRoutingModule } from './omni-routing.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    OmniRoutingModule,
    TranslateModule
  ],
  declarations: []
})
export class OmniModule { }
