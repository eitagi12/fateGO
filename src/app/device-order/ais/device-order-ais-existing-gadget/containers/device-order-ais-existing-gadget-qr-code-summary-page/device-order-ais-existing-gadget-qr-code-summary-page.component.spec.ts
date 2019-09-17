import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingGadgetQrCodeSummaryPageComponent } from './device-order-ais-existing-gadget-qr-code-summary-page.component';

describe('DeviceOrderAisExistingGadgetQrCodeSummaryPageComponent', () => {
  let component: DeviceOrderAisExistingGadgetQrCodeSummaryPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingGadgetQrCodeSummaryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingGadgetQrCodeSummaryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingGadgetQrCodeSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
