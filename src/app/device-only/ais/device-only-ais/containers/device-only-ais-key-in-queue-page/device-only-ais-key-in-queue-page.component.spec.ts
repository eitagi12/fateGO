import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { DeviceOnlyAisKeyInQueuePageComponent } from './device-only-ais-key-in-queue-page.component';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HomeService, TokenService } from 'mychannel-shared-libs';
import { HttpClientModule } from '@angular/common/http';
import { LocalStorageService } from 'ngx-store';
import { Pipe, PipeTransform } from '@angular/core';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';

@Pipe({name: 'mobileNo'})
class MockMobileNoPipe implements PipeTransform {
  transform(value: string): string {
      return value;
  }
}
describe('DeviceOnlyAisKeyInQueuePageComponent', () => {
  let component: DeviceOnlyAisKeyInQueuePageComponent;
  let fixture: ComponentFixture<DeviceOnlyAisKeyInQueuePageComponent>;

  setupTestBed({
    imports: [
      ReactiveFormsModule,
      RouterTestingModule,
      HttpClientModule
    ],
    declarations: [
      DeviceOnlyAisKeyInQueuePageComponent,
      MockMobileNoPipe
    ],
    providers: [
      {
        provide: HomeService,
        useValue: {
          goToHome: jest.fn()
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
              trade : {
                priceType: 'NORMAL',
                normalPrice: '22590',
                promotionPrice: '18500'
              }
            };
          })
        }
      },
      {
        provide: TokenService,
        useValue: {
          getUser: jest.fn()
        }
      },
      LocalStorageService
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyAisKeyInQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
