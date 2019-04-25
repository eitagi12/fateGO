import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisNewRegisterQrCodeErrorPageComponent } from './device-order-ais-new-register-qr-code-error-page.component';

describe('DeviceOrderAisNewRegisterQrCodeErrorPageComponent', () => {
  let component: DeviceOrderAisNewRegisterQrCodeErrorPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisNewRegisterQrCodeErrorPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisNewRegisterQrCodeErrorPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisNewRegisterQrCodeErrorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
