import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingBestBuyValidateCustomerIdCardRepiPageComponent } from './device-order-ais-existing-best-buy-validate-customer-id-card-repi-page.component';

describe('DeviceOrderAisExistingBestBuyValidateCustomerIdCardRepiPageComponent', () => {
  let component: DeviceOrderAisExistingBestBuyValidateCustomerIdCardRepiPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingBestBuyValidateCustomerIdCardRepiPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingBestBuyValidateCustomerIdCardRepiPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingBestBuyValidateCustomerIdCardRepiPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
