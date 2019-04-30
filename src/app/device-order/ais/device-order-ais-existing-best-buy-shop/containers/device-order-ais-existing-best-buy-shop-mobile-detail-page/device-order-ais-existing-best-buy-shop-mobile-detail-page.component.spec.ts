import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingBestBuyShopMobileDetailPageComponent } from './device-order-ais-existing-best-buy-shop-mobile-detail-page.component';

describe('DeviceOrderAisExistingBestBuyShopMobileDetailPageComponent', () => {
  let component: DeviceOrderAisExistingBestBuyShopMobileDetailPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingBestBuyShopMobileDetailPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingBestBuyShopMobileDetailPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingBestBuyShopMobileDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
