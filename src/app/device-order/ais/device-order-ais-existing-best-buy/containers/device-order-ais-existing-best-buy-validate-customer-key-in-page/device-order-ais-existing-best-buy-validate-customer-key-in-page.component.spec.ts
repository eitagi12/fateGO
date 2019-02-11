import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingBestBuyValidateCustomerKeyInPageComponent } from './device-order-ais-existing-best-buy-validate-customer-key-in-page.component';

describe('DeviceOrderAisExistingBestBuyValidateCustomerKeyInPageComponent', () => {
  let component: DeviceOrderAisExistingBestBuyValidateCustomerKeyInPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingBestBuyValidateCustomerKeyInPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingBestBuyValidateCustomerKeyInPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingBestBuyValidateCustomerKeyInPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
