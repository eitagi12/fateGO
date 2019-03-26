import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { DeviceOnlyAisKeyInQueuePageComponent } from './device-only-ais-key-in-queue-page.component';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HomeService } from 'mychannel-shared-libs';

describe('DeviceOnlyAisKeyInQueuePageComponent', () => {
  let component: DeviceOnlyAisKeyInQueuePageComponent;
  let fixture: ComponentFixture<DeviceOnlyAisKeyInQueuePageComponent>;

  setupTestBed({
    imports: [
      ReactiveFormsModule,
      RouterTestingModule
    ],
    declarations: [
      DeviceOnlyAisKeyInQueuePageComponent
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
      }
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
