import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisMnpPaymentDetailPageComponent } from './device-order-ais-mnp-payment-detail-page.component';

describe('DeviceOrderAisMnpPaymentDetailPageComponent', () => {
  let component: DeviceOrderAisMnpPaymentDetailPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisMnpPaymentDetailPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisMnpPaymentDetailPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisMnpPaymentDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
