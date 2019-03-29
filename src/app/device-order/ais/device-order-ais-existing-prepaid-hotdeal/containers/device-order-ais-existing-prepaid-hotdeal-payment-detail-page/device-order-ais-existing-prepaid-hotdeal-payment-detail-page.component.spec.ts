import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingPrepaidHotdealPaymentDetailPageComponent } from './device-order-ais-existing-prepaid-hotdeal-payment-detail-page.component';

describe('DeviceOrderAisExistingPrepaidHotdealPaymentDetailPageComponent', () => {
  let component: DeviceOrderAisExistingPrepaidHotdealPaymentDetailPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingPrepaidHotdealPaymentDetailPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingPrepaidHotdealPaymentDetailPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingPrepaidHotdealPaymentDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
