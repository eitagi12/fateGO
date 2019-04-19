import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingValidateCustomerKeyInPageComponent } from './device-order-ais-existing-validate-customer-key-in-page.component';

describe('DeviceOrderAisExistingValidateCustomerKeyInPageComponent', () => {
  let component: DeviceOrderAisExistingValidateCustomerKeyInPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingValidateCustomerKeyInPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingValidateCustomerKeyInPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingValidateCustomerKeyInPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
