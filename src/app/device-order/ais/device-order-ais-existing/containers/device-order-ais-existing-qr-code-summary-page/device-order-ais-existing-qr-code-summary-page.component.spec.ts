import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingQrCodeSummaryPageComponent } from './device-order-ais-existing-qr-code-summary-page.component';

describe('DeviceOrderAisExistingQrCodeSummaryPageComponent', () => {
  let component: DeviceOrderAisExistingQrCodeSummaryPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingQrCodeSummaryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingQrCodeSummaryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingQrCodeSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
