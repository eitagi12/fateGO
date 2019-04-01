import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisMnpValidateCustomerPageComponent } from './device-order-ais-mnp-validate-customer-page.component';

describe('DeviceOrderAisMnpValidateCustomerPageComponent', () => {
  let component: DeviceOrderAisMnpValidateCustomerPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisMnpValidateCustomerPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisMnpValidateCustomerPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisMnpValidateCustomerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
