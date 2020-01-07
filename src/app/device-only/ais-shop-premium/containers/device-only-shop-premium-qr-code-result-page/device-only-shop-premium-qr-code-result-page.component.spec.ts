import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOnlyShopPremiumQrCodeResultPageComponent } from './device-only-shop-premium-qr-code-result-page.component';

describe('DeviceOnlyShopPremiumQrCodeResultPageComponent', () => {
  let component: DeviceOnlyShopPremiumQrCodeResultPageComponent;
  let fixture: ComponentFixture<DeviceOnlyShopPremiumQrCodeResultPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOnlyShopPremiumQrCodeResultPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyShopPremiumQrCodeResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
