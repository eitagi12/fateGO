import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DeviceOnlyKioskQrCodeGenaratePageComponent } from './device-only-kiosk-qr-code-genarate-page.component';
import { CUSTOM_ELEMENTS_SCHEMA, PipeTransform, Pipe } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { CookiesStorageService, LocalStorageService } from 'ngx-store';
import { JwtHelperService } from '@auth0/angular-jwt/src/jwthelper.service';
import { AlertService } from 'mychannel-shared-libs';
import { QRCodePaymentService } from 'src/app/shared/services/qrcode-payment.service';
import { resolve } from 'path';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';

describe('DeviceOnlyKioskQrCodeGenaratePageComponent', () => {
  let component: DeviceOnlyKioskQrCodeGenaratePageComponent;
  let fixture: ComponentFixture<DeviceOnlyKioskQrCodeGenaratePageComponent>;

  setupTestBed(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
      declarations: [
        DeviceOnlyKioskQrCodeGenaratePageComponent
      ],
      providers: [
        CookiesStorageService,
        HttpClient,
        HttpHandler,
        LocalStorageService,
        QRCodePaymentService,
        {
          provide: JwtHelperService,
          useValue: {
            decodeToken: jest.fn()
          }
        },
        {
          provide: AlertService,
          useValue: {
            question: jest.fn()
          }
        },
        {
          provide: TransactionService,
          useValue: {
            load: jest.fn(() => {
              return {
                data: {
                  payment: {
                    paymentQrCodeType: 'THAI_QR'
                  }
                }
              };
            })
          }
        },
        {
          provide: PriceOptionService,
          useValue: {
            load: jest.fn(() => {
              return {
                trade: {
                  promotionPrice: 123
                }
              };
            })
          }
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyKioskQrCodeGenaratePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  test.skip('it is not snowing', () => {
    expect(component).toBe(0);
  });
  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
