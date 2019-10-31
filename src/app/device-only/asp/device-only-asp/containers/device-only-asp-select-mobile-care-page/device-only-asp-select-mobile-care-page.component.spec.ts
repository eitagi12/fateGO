import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeviceOnlyAspSelectMobileCarePageComponent } from './device-only-asp-select-mobile-care-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeService, TokenService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { CookiesStorageService, LocalStorageService } from 'ngx-store';
import { JwtHelperService } from '@auth0/angular-jwt/src/jwthelper.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { HomeButtonService } from 'src/app/device-only/services/home-button.service';

describe('DeviceOnlyAspSelectMobileCarePageComponent', () => {
  let component: DeviceOnlyAspSelectMobileCarePageComponent;
  let fixture: ComponentFixture<DeviceOnlyAspSelectMobileCarePageComponent>;

  setupTestBed({
    imports: [
      RouterTestingModule.withRoutes([])
    ],
    declarations: [
      DeviceOnlyAspSelectMobileCarePageComponent
    ],
    providers: [
      HttpClient,
      HttpHandler,
      CookiesStorageService,
      LocalStorageService,
      {
        provide: JwtHelperService,
        useValue: {}
      },
      {
        provide: Router,
        useValue: {
          navigate: jest.fn()
        }
      },
      {
        provide: HomeService,
        useValue: {
          goToHome: jest.fn()
        }
      },
      {
        provide: HomeButtonService,
        useValue: {
          initEventButtonHome: jest.fn()
        }
      },
      {
        provide: TransactionService,
        useValue: {
          load: jest.fn(() => {
            return {
              data: {
                mobileCarePackage: {}
              }
            };
          })
        }
      },
      {
        provide: PriceOptionService,
        useValue: {
          load: jest.fn()
        }
      },
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyAspSelectMobileCarePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
