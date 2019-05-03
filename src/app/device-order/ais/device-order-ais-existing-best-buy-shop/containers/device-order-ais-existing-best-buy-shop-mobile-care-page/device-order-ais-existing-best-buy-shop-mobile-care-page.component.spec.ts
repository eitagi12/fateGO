import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingBestBuyShopMobileCarePageComponent } from './device-order-ais-existing-best-buy-shop-mobile-care-page.component';

describe('DeviceOrderAisExistingBestBuyShopMobileCarePageComponent', () => {
  let component: DeviceOrderAisExistingBestBuyShopMobileCarePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingBestBuyShopMobileCarePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingBestBuyShopMobileCarePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingBestBuyShopMobileCarePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
