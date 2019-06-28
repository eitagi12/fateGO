import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingGadgetValidateCustomerIdCardPageComponent } from './device-order-ais-existing-gadget-validate-customer-id-card-page.component';

describe('DeviceOrderAisExistingGadgetValidateCustomerIdCardPageComponent', () => {
  let component: DeviceOrderAisExistingGadgetValidateCustomerIdCardPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingGadgetValidateCustomerIdCardPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingGadgetValidateCustomerIdCardPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingGadgetValidateCustomerIdCardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
