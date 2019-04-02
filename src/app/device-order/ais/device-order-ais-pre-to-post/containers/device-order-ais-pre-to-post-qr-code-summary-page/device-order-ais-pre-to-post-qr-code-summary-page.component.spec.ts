import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisPreToPostQrCodeSummaryPageComponent } from './device-order-ais-pre-to-post-qr-code-summary-page.component';

describe('DeviceOrderAisPreToPostQrCodeSummaryPageComponent', () => {
  let component: DeviceOrderAisPreToPostQrCodeSummaryPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisPreToPostQrCodeSummaryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisPreToPostQrCodeSummaryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisPreToPostQrCodeSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
