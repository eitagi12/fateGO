import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingGadgetPaymentDetailPageComponent } from './device-order-ais-existing-gadget-payment-detail-page.component';

describe('DeviceOrderAisExistingGadgetPaymentDetailPageComponent', () => {
  let component: DeviceOrderAisExistingGadgetPaymentDetailPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingGadgetPaymentDetailPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingGadgetPaymentDetailPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingGadgetPaymentDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
