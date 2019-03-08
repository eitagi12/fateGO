import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingBestBuyQrCodeErrorPageComponent } from './device-order-ais-existing-best-buy-qr-code-error-page.component';

describe('DeviceOrderAisExistingBestBuyQrCodeErrorPageComponent', () => {
  let component: DeviceOrderAisExistingBestBuyQrCodeErrorPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingBestBuyQrCodeErrorPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingBestBuyQrCodeErrorPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingBestBuyQrCodeErrorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
