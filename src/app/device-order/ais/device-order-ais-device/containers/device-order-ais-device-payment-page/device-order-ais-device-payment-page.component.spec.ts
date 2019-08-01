import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisDevicePaymentPageComponent } from './device-order-ais-device-payment-page.component';

describe('DeviceOrderAisDevicePaymentPageComponent', () => {
  let component: DeviceOrderAisDevicePaymentPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisDevicePaymentPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisDevicePaymentPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisDevicePaymentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
