import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOnlyShopPremiumResultPageComponent } from './device-only-shop-premium-result-page.component';

describe('DeviceOnlyShopPremiumResultPageComponent', () => {
  let component: DeviceOnlyShopPremiumResultPageComponent;
  let fixture: ComponentFixture<DeviceOnlyShopPremiumResultPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOnlyShopPremiumResultPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyShopPremiumResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
