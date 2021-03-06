import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';

const { name: name } = require('../../package.json');

import {
  jwtOptionsFactory,
  ErrorsHandler,
  MyChannelSharedLibsModule,
  CookieService,
  IdCardPipe
} from 'mychannel-shared-libs';
import { AppRoutingModule } from './app-routing.module';
/* Components */
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { ErrorPageComponent } from './containers/error-page/error-page.component';
import { SharedModule } from './shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AppComponent,
    ErrorPageComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule, // ต้อง import แค่ครั้งเดียว
    TranslateModule.forRoot(),
    MyChannelSharedLibsModule.forRoot({
      production: environment.production,
      NAME: environment.name,
      WEB_CONNECT_URL: environment.WEB_CONNECT_URL,
      CAMERA_DEVLICE: ['^USB Camera+', '^HP+'],
      CLIENT_NAME: 'client-smart-digital'
    }),
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [CookieService]
      }
    }),
    SharedModule,
    AppRoutingModule,
    TranslateModule.forRoot()
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: ErrorsHandler
    },
    DecimalPipe,
    IdCardPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
