import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOnlyAisCheckoutPaymentPageComponent } from './device-only-ais-checkout-payment-page.component';

describe('DeviceOnlyAisCheckoutPaymentPageComponent', () => {
  let component: DeviceOnlyAisCheckoutPaymentPageComponent;
  let fixture: ComponentFixture<DeviceOnlyAisCheckoutPaymentPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOnlyAisCheckoutPaymentPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyAisCheckoutPaymentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
