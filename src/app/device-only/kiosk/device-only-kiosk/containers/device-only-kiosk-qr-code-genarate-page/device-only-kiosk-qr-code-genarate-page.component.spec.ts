import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOnlyKioskQrCodeGenaratePageComponent } from './device-only-kiosk-qr-code-genarate-page.component';

describe('DeviceOnlyKioskQrCodeGenaratePageComponent', () => {
  let component: DeviceOnlyKioskQrCodeGenaratePageComponent;
  let fixture: ComponentFixture<DeviceOnlyKioskQrCodeGenaratePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOnlyKioskQrCodeGenaratePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyKioskQrCodeGenaratePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
