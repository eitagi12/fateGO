import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisNewRegisterValidateCustomerIdCardPageComponent } from './device-order-ais-new-register-validate-customer-id-card-page.component';

describe('DeviceOrderAisNewRegisterValidateCustomerIdCardPageComponent', () => {
  let component: DeviceOrderAisNewRegisterValidateCustomerIdCardPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisNewRegisterValidateCustomerIdCardPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisNewRegisterValidateCustomerIdCardPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisNewRegisterValidateCustomerIdCardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
