import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeviceOnlyAspQrCodeKeyInQueuePageComponent } from './device-only-asp-qr-code-key-in-queue-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeService, PageLoadingService, TokenService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { Pipe, PipeTransform } from '@angular/core';
import { QueueService } from 'src/app/device-only/services/queue.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHandler, HttpClientModule } from '@angular/common/http';
import { LocalStorageService } from 'ngx-store';
import { HomeButtonService } from 'src/app/device-only/services/home-button.service';

@Pipe({name: 'mobileNo'})
class MockMobileNoPipe implements PipeTransform {
  transform(value: string): string {
      return value;
  }
}

describe('DeviceOnlyAspQrCodeKeyInQueuePageComponent', () => {
  let component: DeviceOnlyAspQrCodeKeyInQueuePageComponent;
  let fixture: ComponentFixture<DeviceOnlyAspQrCodeKeyInQueuePageComponent>;

  setupTestBed({
    imports: [
      ReactiveFormsModule,
      RouterTestingModule,
      HttpClientModule
    ],
    declarations: [
      DeviceOnlyAspQrCodeKeyInQueuePageComponent,
      MockMobileNoPipe
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
      FormBuilder,
      QueueService,
      PageLoadingService,
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
          load: jest.fn()
        }
      },
      {
        provide: PriceOptionService,
        useValue: {
          load: jest.fn(() => {
            return {
              trade: {
                priceType: 'NORMAL',
                normalPrice: '22590',
                promotionPrice: '18500'
              },
            };
          })
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
    fixture = TestBed.createComponent(DeviceOnlyAspQrCodeKeyInQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
