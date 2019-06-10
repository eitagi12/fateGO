import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOnlyKioskQrCodeKeyInQueuePageComponent } from './device-only-kiosk-qr-code-key-in-queue-page.component';

describe('DeviceOnlyKioskQrCodeKeyInQueuePageComponent', () => {
  let component: DeviceOnlyKioskQrCodeKeyInQueuePageComponent;
  let fixture: ComponentFixture<DeviceOnlyKioskQrCodeKeyInQueuePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOnlyKioskQrCodeKeyInQueuePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyKioskQrCodeKeyInQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
