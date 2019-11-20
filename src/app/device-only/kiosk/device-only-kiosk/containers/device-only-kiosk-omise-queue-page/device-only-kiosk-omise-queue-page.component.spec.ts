import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOnlyKioskOmiseQueuePageComponent } from './device-only-kiosk-omise-queue-page.component';

describe('DeviceOnlyKioskOmiseQueuePageComponent', () => {
  let component: DeviceOnlyKioskOmiseQueuePageComponent;
  let fixture: ComponentFixture<DeviceOnlyKioskOmiseQueuePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOnlyKioskOmiseQueuePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyKioskOmiseQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
