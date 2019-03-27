import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingBestBuyValidateCustomerPageComponent } from './device-order-ais-existing-best-buy-validate-customer-page.component';

describe('DeviceOrderAisExistingBestBuyValidateCustomerPageComponent', () => {
  let component: DeviceOrderAisExistingBestBuyValidateCustomerPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingBestBuyValidateCustomerPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingBestBuyValidateCustomerPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingBestBuyValidateCustomerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
