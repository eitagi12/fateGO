import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOnlyKioskQrCodeQueuePageComponent } from './device-only-kiosk-qr-code-queue-page.component';

describe('DeviceOnlyKioskQrCodeQueuePageComponent', () => {
  let component: DeviceOnlyKioskQrCodeQueuePageComponent;
  let fixture: ComponentFixture<DeviceOnlyKioskQrCodeQueuePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOnlyKioskQrCodeQueuePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyKioskQrCodeQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
