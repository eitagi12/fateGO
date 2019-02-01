import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingPaymentDetailPageComponent } from './device-order-ais-existing-payment-detail-page.component';

describe('DeviceOrderAisExistingPaymentDetailPageComponent', () => {
  let component: DeviceOrderAisExistingPaymentDetailPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingPaymentDetailPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingPaymentDetailPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingPaymentDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
