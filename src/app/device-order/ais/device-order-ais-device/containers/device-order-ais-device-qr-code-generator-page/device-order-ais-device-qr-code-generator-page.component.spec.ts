import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisDeviceQrCodeGeneratorPageComponent } from './device-order-ais-device-qr-code-generator-page.component';

describe('DeviceOrderAisDeviceQrCodeGeneratorPageComponent', () => {
  let component: DeviceOrderAisDeviceQrCodeGeneratorPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisDeviceQrCodeGeneratorPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisDeviceQrCodeGeneratorPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisDeviceQrCodeGeneratorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
