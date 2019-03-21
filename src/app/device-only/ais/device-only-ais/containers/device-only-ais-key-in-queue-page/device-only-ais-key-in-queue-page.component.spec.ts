import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { DeviceOnlyAisKeyInQueuePageComponent } from './device-only-ais-key-in-queue-page.component';
import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HomeService } from 'mychannel-shared-libs';

describe('DeviceOnlyAisKeyInQueuePageComponent', () => {
  let component: DeviceOnlyAisKeyInQueuePageComponent;
  let fixture: ComponentFixture<DeviceOnlyAisKeyInQueuePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
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
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyAisKeyInQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
