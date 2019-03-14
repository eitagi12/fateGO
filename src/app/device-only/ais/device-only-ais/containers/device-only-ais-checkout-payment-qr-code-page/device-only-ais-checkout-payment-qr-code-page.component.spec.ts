import { CUSTOM_ELEMENTS_SCHEMA, PipeTransform, Pipe } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { DeviceOnlyAisCheckoutPaymentQrCodePageComponent } from './device-only-ais-checkout-payment-qr-code-page.component';
import { CookiesStorageService } from 'ngx-store';
import { JwtHelperService } from '@auth0/angular-jwt/src/jwthelper.service';

@Pipe({name: 'mobileNo'})
class MockMobileNoPipe implements PipeTransform {
  transform(value: string): string {
      return value;
  }
}

describe('DeviceOnlyAisCheckoutPaymentQrCodePageComponent', () => {
  let component: DeviceOnlyAisCheckoutPaymentQrCodePageComponent;
  let fixture: ComponentFixture<DeviceOnlyAisCheckoutPaymentQrCodePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [
        DeviceOnlyAisCheckoutPaymentQrCodePageComponent,
        MockMobileNoPipe
      ],
      providers: [
        CookiesStorageService,
        {
          provide: JwtHelperService,
          useValue: {}
        },
        HttpClient,
        HttpHandler
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyAisCheckoutPaymentQrCodePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
