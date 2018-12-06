import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisNewRegisterValidateCustomerKeyInPageComponent } from './device-order-ais-new-register-validate-customer-key-in-page.component';

describe('DeviceOrderAisNewRegisterValidateCustomerKeyInPageComponent', () => {
  let component: DeviceOrderAisNewRegisterValidateCustomerKeyInPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisNewRegisterValidateCustomerKeyInPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisNewRegisterValidateCustomerKeyInPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisNewRegisterValidateCustomerKeyInPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
