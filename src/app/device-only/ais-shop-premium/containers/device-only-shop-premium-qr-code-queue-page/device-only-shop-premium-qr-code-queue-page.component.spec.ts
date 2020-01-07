import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOnlyShopPremiumQrCodeQueuePageComponent } from './device-only-shop-premium-qr-code-queue-page.component';

describe('DeviceOnlyShopPremiumQrCodeQueuePageComponent', () => {
  let component: DeviceOnlyShopPremiumQrCodeQueuePageComponent;
  let fixture: ComponentFixture<DeviceOnlyShopPremiumQrCodeQueuePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOnlyShopPremiumQrCodeQueuePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyShopPremiumQrCodeQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
