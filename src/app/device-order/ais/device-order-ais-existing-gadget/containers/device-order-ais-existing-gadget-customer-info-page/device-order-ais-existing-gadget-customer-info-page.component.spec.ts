import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingGadgetCustomerInfoPageComponent } from './device-order-ais-existing-gadget-customer-info-page.component';

describe('DeviceOrderAisExistingGadgetCustomerInfoPageComponent', () => {
  let component: DeviceOrderAisExistingGadgetCustomerInfoPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingGadgetCustomerInfoPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingGadgetCustomerInfoPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingGadgetCustomerInfoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
