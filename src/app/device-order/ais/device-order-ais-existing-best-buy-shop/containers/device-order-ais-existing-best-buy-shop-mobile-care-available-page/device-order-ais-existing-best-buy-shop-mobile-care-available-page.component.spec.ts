import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingBestBuyShopMobileCareAvailablePageComponent } from './device-order-ais-existing-best-buy-shop-mobile-care-available-page.component';

describe('DeviceOrderAisExistingBestBuyShopMobileCareAvailablePageComponent', () => {
  let component: DeviceOrderAisExistingBestBuyShopMobileCareAvailablePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingBestBuyShopMobileCareAvailablePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingBestBuyShopMobileCareAvailablePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingBestBuyShopMobileCareAvailablePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
