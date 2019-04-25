import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAspExistingBestBuyCustomerProfilePageComponent } from './device-order-asp-existing-best-buy-customer-profile-page.component';

describe('DeviceOrderAspExistingBestBuyCustomerProfilePageComponent', () => {
  let component: DeviceOrderAspExistingBestBuyCustomerProfilePageComponent;
  let fixture: ComponentFixture<DeviceOrderAspExistingBestBuyCustomerProfilePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAspExistingBestBuyCustomerProfilePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAspExistingBestBuyCustomerProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
