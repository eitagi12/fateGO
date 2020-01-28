import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOnlyShopPremiumQrCodeGeneratorPageComponent } from './device-only-shop-premium-qr-code-generator-page.component';

describe('DeviceOnlyShopPremiumQrCodeGeneratorPageComponent', () => {
  let component: DeviceOnlyShopPremiumQrCodeGeneratorPageComponent;
  let fixture: ComponentFixture<DeviceOnlyShopPremiumQrCodeGeneratorPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOnlyShopPremiumQrCodeGeneratorPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyShopPremiumQrCodeGeneratorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
