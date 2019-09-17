import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisDeviceQrCodeSummaryPageComponent } from './device-order-ais-device-qr-code-summary-page.component';

describe('DeviceOrderAisDeviceQrCodeSummaryPageComponent', () => {
  let component: DeviceOrderAisDeviceQrCodeSummaryPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisDeviceQrCodeSummaryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisDeviceQrCodeSummaryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisDeviceQrCodeSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
