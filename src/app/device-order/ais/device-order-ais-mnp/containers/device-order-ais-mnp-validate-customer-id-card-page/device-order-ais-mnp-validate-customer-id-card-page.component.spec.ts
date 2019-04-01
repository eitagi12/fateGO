import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisMnpValidateCustomerIdCardPageComponent } from './device-order-ais-mnp-validate-customer-id-card-page.component';

describe('DeviceOrderAisMnpValidateCustomerIdCardPageComponent', () => {
  let component: DeviceOrderAisMnpValidateCustomerIdCardPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisMnpValidateCustomerIdCardPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisMnpValidateCustomerIdCardPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisMnpValidateCustomerIdCardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
