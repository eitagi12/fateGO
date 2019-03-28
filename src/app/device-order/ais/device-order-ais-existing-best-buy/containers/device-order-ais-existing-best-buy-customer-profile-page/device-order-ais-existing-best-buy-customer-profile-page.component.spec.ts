import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingBestBuyCustomerProfilePageComponent } from './device-order-ais-existing-best-buy-customer-profile-page.component';

describe('DeviceOrderAisExistingBestBuyCustomerProfilePageComponent', () => {
  let component: DeviceOrderAisExistingBestBuyCustomerProfilePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingBestBuyCustomerProfilePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingBestBuyCustomerProfilePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingBestBuyCustomerProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
