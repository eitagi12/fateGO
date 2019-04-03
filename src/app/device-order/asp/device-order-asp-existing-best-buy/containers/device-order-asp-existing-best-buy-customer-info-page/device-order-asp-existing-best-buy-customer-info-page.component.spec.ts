import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAspExistingBestBuyCustomerInfoPageComponent } from './device-order-asp-existing-best-buy-customer-info-page.component';

describe('DeviceOrderAspExistingBestBuyCustomerInfoPageComponent', () => {
  let component: DeviceOrderAspExistingBestBuyCustomerInfoPageComponent;
  let fixture: ComponentFixture<DeviceOrderAspExistingBestBuyCustomerInfoPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAspExistingBestBuyCustomerInfoPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAspExistingBestBuyCustomerInfoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
