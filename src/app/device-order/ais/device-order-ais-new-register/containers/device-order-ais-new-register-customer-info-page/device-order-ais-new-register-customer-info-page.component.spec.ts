import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisNewRegisterCustomerInfoPageComponent } from './device-order-ais-new-register-customer-info-page.component';

describe('DeviceOrderAisNewRegisterCustomerInfoPageComponent', () => {
  let component: DeviceOrderAisNewRegisterCustomerInfoPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisNewRegisterCustomerInfoPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisNewRegisterCustomerInfoPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisNewRegisterCustomerInfoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
