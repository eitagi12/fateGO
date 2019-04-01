import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingBestBuyValidateCustomerIdCardPageComponent } from './device-order-ais-existing-best-buy-validate-customer-id-card-page.component';

describe('DeviceOrderAisExistingBestBuyValidateCustomerIdCardPageComponent', () => {
  let component: DeviceOrderAisExistingBestBuyValidateCustomerIdCardPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingBestBuyValidateCustomerIdCardPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingBestBuyValidateCustomerIdCardPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingBestBuyValidateCustomerIdCardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
