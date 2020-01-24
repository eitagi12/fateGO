import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOnlyShopPremiumQrCodeSummaryPageComponent } from './device-only-shop-premium-qr-code-summary-page.component';

describe('DeviceOnlyShopPremiumQrCodeSummaryPageComponent', () => {
  let component: DeviceOnlyShopPremiumQrCodeSummaryPageComponent;
  let fixture: ComponentFixture<DeviceOnlyShopPremiumQrCodeSummaryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOnlyShopPremiumQrCodeSummaryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyShopPremiumQrCodeSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
