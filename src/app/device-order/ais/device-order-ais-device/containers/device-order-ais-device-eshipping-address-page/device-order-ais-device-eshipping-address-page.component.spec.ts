import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisDeviceEshippingAddressPageComponent } from './device-order-ais-device-eshipping-address-page.component';

describe('DeviceOrderAisDeviceEshippingAddressPageComponent', () => {
  let component: DeviceOrderAisDeviceEshippingAddressPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisDeviceEshippingAddressPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisDeviceEshippingAddressPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisDeviceEshippingAddressPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
