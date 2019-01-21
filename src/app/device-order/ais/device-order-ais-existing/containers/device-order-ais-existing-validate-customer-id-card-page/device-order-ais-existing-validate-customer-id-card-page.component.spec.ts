import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingValidateCustomerIdCardPageComponent } from './device-order-ais-existing-validate-customer-id-card-page.component';

describe('DeviceOrderAisExistingValidateCustomerIdCardPageComponent', () => {
  let component: DeviceOrderAisExistingValidateCustomerIdCardPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingValidateCustomerIdCardPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingValidateCustomerIdCardPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingValidateCustomerIdCardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
