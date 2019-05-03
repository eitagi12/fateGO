import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingBestBuyShopEligibleMobilePageComponent } from './device-order-ais-existing-best-buy-shop-eligible-mobile-page.component';

describe('DeviceOrderAisExistingBestBuyShopEligibleMobilePageComponent', () => {
  let component: DeviceOrderAisExistingBestBuyShopEligibleMobilePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingBestBuyShopEligibleMobilePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingBestBuyShopEligibleMobilePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingBestBuyShopEligibleMobilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
