import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingBestBuyShopIdcardCaptureRepiPageComponent } from './device-order-ais-existing-best-buy-shop-idcard-capture-repi-page.component';

describe('DeviceOrderAisExistingBestBuyShopIdcardCaptureRepiPageComponent', () => {
  let component: DeviceOrderAisExistingBestBuyShopIdcardCaptureRepiPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingBestBuyShopIdcardCaptureRepiPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingBestBuyShopIdcardCaptureRepiPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingBestBuyShopIdcardCaptureRepiPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
