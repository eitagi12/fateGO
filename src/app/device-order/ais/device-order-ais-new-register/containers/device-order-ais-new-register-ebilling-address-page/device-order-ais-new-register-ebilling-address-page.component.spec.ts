import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisNewRegisterEbillingAddressPageComponent } from './device-order-ais-new-register-ebilling-address-page.component';

describe('DeviceOrderAisNewRegisterEbillingAddressPageComponent', () => {
  let component: DeviceOrderAisNewRegisterEbillingAddressPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisNewRegisterEbillingAddressPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisNewRegisterEbillingAddressPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisNewRegisterEbillingAddressPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
