import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingBestBuyPaymentDetailPageComponent } from './device-order-ais-existing-best-buy-payment-detail-page.component';

describe('DeviceOrderAisExistingBestBuyPaymentDetailPageComponent', () => {
  let component: DeviceOrderAisExistingBestBuyPaymentDetailPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingBestBuyPaymentDetailPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingBestBuyPaymentDetailPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingBestBuyPaymentDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
