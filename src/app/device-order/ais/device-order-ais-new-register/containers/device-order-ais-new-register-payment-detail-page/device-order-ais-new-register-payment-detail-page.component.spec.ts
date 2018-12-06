import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisNewRegisterPaymentDetailPageComponent } from './device-order-ais-new-register-payment-detail-page.component';

describe('DeviceOrderAisNewRegisterPaymentDetailPageComponent', () => {
  let component: DeviceOrderAisNewRegisterPaymentDetailPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisNewRegisterPaymentDetailPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisNewRegisterPaymentDetailPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisNewRegisterPaymentDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
