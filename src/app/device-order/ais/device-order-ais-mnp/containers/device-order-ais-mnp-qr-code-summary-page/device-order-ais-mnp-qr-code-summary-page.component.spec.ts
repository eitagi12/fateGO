import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisMnpQrCodeSummaryPageComponent } from './device-order-ais-mnp-qr-code-summary-page.component';

describe('DeviceOrderAisMnpQrCodeSummaryPageComponent', () => {
  let component: DeviceOrderAisMnpQrCodeSummaryPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisMnpQrCodeSummaryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisMnpQrCodeSummaryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisMnpQrCodeSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
