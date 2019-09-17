import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisDeviceQrCodeResultPageComponent } from './device-order-ais-device-qr-code-result-page.component';

describe('DeviceOrderAisDeviceQrCodeResultPageComponent', () => {
  let component: DeviceOrderAisDeviceQrCodeResultPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisDeviceQrCodeResultPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisDeviceQrCodeResultPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisDeviceQrCodeResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
