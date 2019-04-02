import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOnlyAutoGetQueuePageComponent } from './device-only-ais-auto-get-queue-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { Pipe, PipeTransform } from '@angular/core';
import { HomeService, TokenService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { LocalStorageService } from 'ngx-store';

@Pipe({name: 'mobileNo'})
class MockMobileNoPipe implements PipeTransform {
  transform(value: string): string {
      return value;
  }
}
describe('AutoGetQueuePageComponent', () => {
  let component: DeviceOnlyAutoGetQueuePageComponent;
  let fixture: ComponentFixture<DeviceOnlyAutoGetQueuePageComponent>;

  setupTestBed({
    imports: [
      ReactiveFormsModule,
      RouterTestingModule,
      HttpClientModule
    ],
    declarations: [
      DeviceOnlyAutoGetQueuePageComponent,
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
    fixture = TestBed.createComponent(DeviceOnlyAutoGetQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
