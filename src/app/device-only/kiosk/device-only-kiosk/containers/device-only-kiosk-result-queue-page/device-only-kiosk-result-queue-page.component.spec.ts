import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOnlyKioskResultQueuePageComponent } from './device-only-kiosk-result-queue-page.component';

describe('DeviceOnlyKioskResultQueuePageComponent', () => {
  let component: DeviceOnlyKioskResultQueuePageComponent;
  let fixture: ComponentFixture<DeviceOnlyKioskResultQueuePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOnlyKioskResultQueuePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyKioskResultQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
