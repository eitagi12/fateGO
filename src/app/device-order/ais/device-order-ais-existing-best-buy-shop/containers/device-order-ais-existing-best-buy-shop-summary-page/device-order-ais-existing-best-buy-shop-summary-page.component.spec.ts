import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingBestBuyShopSummaryPageComponent } from './device-order-ais-existing-best-buy-shop-summary-page.component';

describe('DeviceOrderAisExistingBestBuyShopSummaryPageComponent', () => {
  let component: DeviceOrderAisExistingBestBuyShopSummaryPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingBestBuyShopSummaryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingBestBuyShopSummaryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingBestBuyShopSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
