import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAspExistingBestBuyPaymentDetailPageComponent } from './device-order-asp-existing-best-buy-payment-detail-page.component';

describe('DeviceOrderAspExistingBestBuyPaymentDetailPageComponent', () => {
  let component: DeviceOrderAspExistingBestBuyPaymentDetailPageComponent;
  let fixture: ComponentFixture<DeviceOrderAspExistingBestBuyPaymentDetailPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAspExistingBestBuyPaymentDetailPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAspExistingBestBuyPaymentDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
