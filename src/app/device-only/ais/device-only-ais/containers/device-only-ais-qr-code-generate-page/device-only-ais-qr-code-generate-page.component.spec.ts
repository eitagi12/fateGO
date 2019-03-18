import { CUSTOM_ELEMENTS_SCHEMA, PipeTransform, Pipe } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { DeviceOnlyAisQrCodeGeneratePageComponent } from './device-only-ais-qr-code-generate-page.component';
import { CookiesStorageService, LocalStorageService } from 'ngx-store';
import { JwtHelperService } from '@auth0/angular-jwt/src/jwthelper.service';
import { AlertService } from 'mychannel-shared-libs';

describe('DeviceOnlyAisQrCodeGeneratePageComponent', () => {
  let component: DeviceOnlyAisQrCodeGeneratePageComponent;
  let fixture: ComponentFixture<DeviceOnlyAisQrCodeGeneratePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [
        DeviceOnlyAisQrCodeGeneratePageComponent
      ],
      providers: [
        CookiesStorageService,
        {
          provide: JwtHelperService,
          useValue: { decodeToken: jest.fn() }
        },
        HttpClient,
        HttpHandler,
        LocalStorageService,
        {
          provide: AlertService,
          useValue: {
           question: jest.fn()
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyAisQrCodeGeneratePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
