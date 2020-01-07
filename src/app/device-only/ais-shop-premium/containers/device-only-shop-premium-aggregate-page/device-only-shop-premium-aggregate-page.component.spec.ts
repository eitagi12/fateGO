import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOnlyShopPremiumAggregatePageComponent } from './device-only-shop-premium-aggregate-page.component';

describe('DeviceOnlyShopPremiumAggregatePageComponent', () => {
  let component: DeviceOnlyShopPremiumAggregatePageComponent;
  let fixture: ComponentFixture<DeviceOnlyShopPremiumAggregatePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOnlyShopPremiumAggregatePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyShopPremiumAggregatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
