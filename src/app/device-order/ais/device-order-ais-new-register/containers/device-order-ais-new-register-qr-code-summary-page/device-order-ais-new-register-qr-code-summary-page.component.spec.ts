import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisNewRegisterQrCodeSummaryPageComponent } from './device-order-ais-new-register-qr-code-summary-page.component';

describe('DeviceOrderAisNewRegisterQrCodeSummaryPageComponent', () => {
  let component: DeviceOrderAisNewRegisterQrCodeSummaryPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisNewRegisterQrCodeSummaryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisNewRegisterQrCodeSummaryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisNewRegisterQrCodeSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
