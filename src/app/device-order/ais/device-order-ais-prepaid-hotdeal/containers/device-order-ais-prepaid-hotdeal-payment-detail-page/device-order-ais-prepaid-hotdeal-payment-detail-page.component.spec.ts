import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisPrepaidHotdealPaymentDetailPageComponent } from './device-order-ais-prepaid-hotdeal-payment-detail-page.component';

describe('DeviceOrderAisPrepaidHotdealPaymentDetailPageComponent', () => {
  let component: DeviceOrderAisPrepaidHotdealPaymentDetailPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisPrepaidHotdealPaymentDetailPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisPrepaidHotdealPaymentDetailPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisPrepaidHotdealPaymentDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
