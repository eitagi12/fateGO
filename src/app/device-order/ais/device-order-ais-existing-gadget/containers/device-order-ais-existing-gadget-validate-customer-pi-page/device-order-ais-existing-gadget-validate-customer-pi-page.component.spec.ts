import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingGadgetValidateCustomerPiPageComponent } from './device-order-ais-existing-gadget-validate-customer-pi-page.component';

describe('DeviceOrderAisExistingGadgetValidateCustomerPiPageComponent', () => {
  let component: DeviceOrderAisExistingGadgetValidateCustomerPiPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingGadgetValidateCustomerPiPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingGadgetValidateCustomerPiPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingGadgetValidateCustomerPiPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
