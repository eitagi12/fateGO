import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingGadgetValidateCustomerPageComponent } from './device-order-ais-existing-gadget-validate-customer-page.component';

describe('DeviceOrderAisExistingGadgetValidateCustomerPageComponent', () => {
  let component: DeviceOrderAisExistingGadgetValidateCustomerPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingGadgetValidateCustomerPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingGadgetValidateCustomerPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingGadgetValidateCustomerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
