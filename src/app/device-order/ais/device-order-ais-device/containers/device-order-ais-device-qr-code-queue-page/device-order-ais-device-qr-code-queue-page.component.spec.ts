import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisDeviceQrCodeQueuePageComponent } from './device-order-ais-device-qr-code-queue-page.component';

describe('DeviceOrderAisDeviceQrCodeQueuePageComponent', () => {
  let component: DeviceOrderAisDeviceQrCodeQueuePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisDeviceQrCodeQueuePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisDeviceQrCodeQueuePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisDeviceQrCodeQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
