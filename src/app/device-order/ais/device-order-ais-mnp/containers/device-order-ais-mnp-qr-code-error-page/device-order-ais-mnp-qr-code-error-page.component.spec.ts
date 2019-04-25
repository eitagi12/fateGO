import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisMnpQrCodeErrorPageComponent } from './device-order-ais-mnp-qr-code-error-page.component';

describe('DeviceOrderAisMnpQrCodeErrorPageComponent', () => {
  let component: DeviceOrderAisMnpQrCodeErrorPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisMnpQrCodeErrorPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisMnpQrCodeErrorPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisMnpQrCodeErrorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
