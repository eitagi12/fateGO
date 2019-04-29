import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HomeService, TokenService } from 'mychannel-shared-libs';
import { HttpClientModule } from '@angular/common/http';
import { LocalStorageService } from 'ngx-store';
import { Pipe, PipeTransform } from '@angular/core';
import { DeviceOnlyAisQrCodeKeyInQueuePageComponent } from './device-only-ais-qr-code-key-in-queue-page.component';

@Pipe({name: 'mobileNo'})
class MockMobileNoPipe implements PipeTransform {
  transform(value: string): string {
      return value;
  }
}
describe('DeviceOnlyAisKeyInQueuePageComponent', () => {
  let component: DeviceOnlyAisQrCodeKeyInQueuePageComponent;
  let fixture: ComponentFixture<DeviceOnlyAisQrCodeKeyInQueuePageComponent>;

  setupTestBed({
    imports: [
      ReactiveFormsModule,
      RouterTestingModule,
      HttpClientModule
    ],
    declarations: [
      DeviceOnlyAisQrCodeKeyInQueuePageComponent,
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
        provide: TokenService,
        useValue: {
          getUser: jest.fn()
        }
      },
      LocalStorageService
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyAisQrCodeKeyInQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
