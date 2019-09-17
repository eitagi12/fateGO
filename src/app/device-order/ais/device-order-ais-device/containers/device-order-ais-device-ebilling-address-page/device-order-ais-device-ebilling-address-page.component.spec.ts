import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisDeviceEbillingAddressPageComponent } from './device-order-ais-device-ebilling-address-page.component';

describe('DeviceOrderAisDeviceEbillingAddressPageComponent', () => {
  let component: DeviceOrderAisDeviceEbillingAddressPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisDeviceEbillingAddressPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisDeviceEbillingAddressPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisDeviceEbillingAddressPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
