import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisDeviceOtpPageComponent } from './device-order-ais-device-otp-page.component';

describe('DeviceOrderAisDeviceOtpPageComponent', () => {
  let component: DeviceOrderAisDeviceOtpPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisDeviceOtpPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisDeviceOtpPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisDeviceOtpPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
