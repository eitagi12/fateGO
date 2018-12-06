import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisNewRegisterValidateCustomerPageComponent } from './device-order-ais-new-register-validate-customer-page.component';

describe('DeviceOrderAisNewRegisterValidateCustomerPageComponent', () => {
  let component: DeviceOrderAisNewRegisterValidateCustomerPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisNewRegisterValidateCustomerPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisNewRegisterValidateCustomerPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisNewRegisterValidateCustomerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
