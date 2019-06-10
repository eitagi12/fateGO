import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeviceOnlyAspSummaryPageComponent } from './device-only-asp-summary-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeService, TokenService, AlertService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { SellerService } from 'src/app/device-only/services/seller.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { LocalStorageService } from 'ngx-store';
import { HomeButtonService } from 'src/app/device-only/services/home-button.service';

describe('DeviceOnlyAspSummaryPageComponent', () => {
  let component: DeviceOnlyAspSummaryPageComponent;
  let fixture: ComponentFixture<DeviceOnlyAspSummaryPageComponent>;

  setupTestBed({
    import: [
      RouterTestingModule.withRoutes([])
    ],
    declarations: [
      DeviceOnlyAspSummaryPageComponent
    ],
    providers: [
      HttpClient,
      HttpHandler,
      LocalStorageService,
      {
        provide: Router,
        useValue: {
          navigate: jest.fn()
        }
      },
      {
        provide: AlertService,
        useValue: {
          warning: jest.fn()
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
        provide: SellerService,
        useValue: {
          checkSeller: jest.fn()
        }
      },
      {
        provide: TransactionService,
        useValue: {
          load: jest.fn()
        }
      },
      {
        provide: TokenService,
        useValue: {
          getUser: jest.fn()
        }
      }
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyAspSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
