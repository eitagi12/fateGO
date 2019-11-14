import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingBestBuyShopOmiseSummaryPageComponent } from './device-order-ais-existing-best-buy-shop-omise-summary-page.component';

describe('DeviceOrderAisExistingBestBuyShopOmiseSummaryPageComponent', () => {
  let component: DeviceOrderAisExistingBestBuyShopOmiseSummaryPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingBestBuyShopOmiseSummaryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingBestBuyShopOmiseSummaryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingBestBuyShopOmiseSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
