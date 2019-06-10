import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOnlyKioskQueuePageComponent } from './device-only-kiosk-queue-page.component';

describe('DeviceOnlyKioskQueuePageComponent', () => {
  let component: DeviceOnlyKioskQueuePageComponent;
  let fixture: ComponentFixture<DeviceOnlyKioskQueuePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOnlyKioskQueuePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyKioskQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
