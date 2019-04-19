import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingBestBuyQrCodeSummaryPageComponent } from './device-order-ais-existing-best-buy-qr-code-summary-page.component';

describe('DeviceOrderAisExistingBestBuyQrCodeSummaryPageComponent', () => {
  let component: DeviceOrderAisExistingBestBuyQrCodeSummaryPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingBestBuyQrCodeSummaryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingBestBuyQrCodeSummaryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingBestBuyQrCodeSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
