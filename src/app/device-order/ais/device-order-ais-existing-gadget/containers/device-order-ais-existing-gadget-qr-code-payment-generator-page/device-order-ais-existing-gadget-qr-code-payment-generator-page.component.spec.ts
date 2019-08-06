import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingGadgetQrCodePaymentGeneratorPageComponent } from './device-order-ais-existing-gadget-qr-code-payment-generator-page.component';

describe('DeviceOrderAisExistingGadgetQrCodePaymentGeneratorPageComponent', () => {
  let component: DeviceOrderAisExistingGadgetQrCodePaymentGeneratorPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingGadgetQrCodePaymentGeneratorPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingGadgetQrCodePaymentGeneratorPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingGadgetQrCodePaymentGeneratorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
