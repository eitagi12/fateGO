import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  HammerGestureConfig
} from '@angular/platform-browser';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import {
  jwtOptionsFactory,
  ErrorsHandler,
  MyChannelSharedLibsModule,
} from 'mychannel-shared-libs';
import { AppRoutingModule } from './app-routing.module';
/* Components */
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { ErrorPageComponent } from './containers/error-page/error-page.component';
import { CookiesStorageService } from 'ngx-store';
import { SharedModule } from './shared/shared.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    ErrorPageComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule, // ต้อง import แค่ครั้งเดียว
    MyChannelSharedLibsModule.forRoot({
      production: environment.production,
      NAME: environment.name,
      WEB_CONNECT_URL: environment.WEB_CONNECT_URL
    }),
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [CookiesStorageService]
      }
    }),
    SharedModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: ErrorsHandler
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
