import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingBestBuyShopOmiseResultPageComponent } from './device-order-ais-existing-best-buy-shop-omise-result-page.component';

describe('DeviceOrderAisExistingBestBuyShopOmiseResultPageComponent', () => {
  let component: DeviceOrderAisExistingBestBuyShopOmiseResultPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingBestBuyShopOmiseResultPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingBestBuyShopOmiseResultPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingBestBuyShopOmiseResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
