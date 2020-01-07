import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOnlyShopPremiumSummaryPageComponent } from './device-only-shop-premium-summary-page.component';

describe('DeviceOnlyShopPremiumSummaryPageComponent', () => {
  let component: DeviceOnlyShopPremiumSummaryPageComponent;
  let fixture: ComponentFixture<DeviceOnlyShopPremiumSummaryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOnlyShopPremiumSummaryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyShopPremiumSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
