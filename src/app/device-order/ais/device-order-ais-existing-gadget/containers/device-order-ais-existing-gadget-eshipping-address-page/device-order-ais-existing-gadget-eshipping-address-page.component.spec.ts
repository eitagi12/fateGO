import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingGadgetEshippingAddressPageComponent } from './device-order-ais-existing-gadget-eshipping-address-page.component';

describe('DeviceOrderAisExistingGadgetEshippingAddressPageComponent', () => {
  let component: DeviceOrderAisExistingGadgetEshippingAddressPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingGadgetEshippingAddressPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingGadgetEshippingAddressPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingGadgetEshippingAddressPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
