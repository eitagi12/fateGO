import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisMnpValidateCustomerKeyInPageComponent } from './device-order-ais-mnp-validate-customer-key-in-page.component';

describe('DeviceOrderAisMnpValidateCustomerKeyInPageComponent', () => {
  let component: DeviceOrderAisMnpValidateCustomerKeyInPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisMnpValidateCustomerKeyInPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisMnpValidateCustomerKeyInPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisMnpValidateCustomerKeyInPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
