import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOnlyShopPremiumPaymentPageComponent } from './device-only-shop-premium-payment-page.component';

describe('DeviceOnlyShopPremiumPaymentPageComponent', () => {
  let component: DeviceOnlyShopPremiumPaymentPageComponent;
  let fixture: ComponentFixture<DeviceOnlyShopPremiumPaymentPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOnlyShopPremiumPaymentPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyShopPremiumPaymentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
