import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DeviceOnlyAisQrCodeGeneratePageComponent } from './device-only-ais-qr-code-generate-page.component';
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

describe('DeviceOnlyAisQrCodeGeneratePageComponent', () => {
  let component: DeviceOnlyAisQrCodeGeneratePageComponent;
  let fixture: ComponentFixture<DeviceOnlyAisQrCodeGeneratePageComponent>;

  setupTestBed(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
      declarations: [
        DeviceOnlyAisQrCodeGeneratePageComponent
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
    fixture = TestBed.createComponent(DeviceOnlyAisQrCodeGeneratePageComponent);
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
