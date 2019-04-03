import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAspExistingBestBuyQrCodeSummaryPageComponent } from './device-order-asp-existing-best-buy-qr-code-summary-page.component';

describe('DeviceOrderAspExistingBestBuyQrCodeSummaryPageComponent', () => {
  let component: DeviceOrderAspExistingBestBuyQrCodeSummaryPageComponent;
  let fixture: ComponentFixture<DeviceOrderAspExistingBestBuyQrCodeSummaryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAspExistingBestBuyQrCodeSummaryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAspExistingBestBuyQrCodeSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
