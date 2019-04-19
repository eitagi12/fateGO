import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainMenuRoutingModule } from './main-menu-routing.module';
import { MainMenuPageComponent } from './containers/main-menu-page/main-menu-page.component';

@NgModule({
  imports: [
    CommonModule,
    MainMenuRoutingModule
  ],
  declarations: [
    MainMenuPageComponent
  ]
})
export class MainMenuModule { }
