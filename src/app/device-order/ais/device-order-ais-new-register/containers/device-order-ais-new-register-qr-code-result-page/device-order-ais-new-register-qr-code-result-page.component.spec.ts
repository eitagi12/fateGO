import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisNewRegisterQrCodeResultPageComponent } from './device-order-ais-new-register-qr-code-result-page.component';

describe('DeviceOrderAisNewRegisterQrCodeResultPageComponent', () => {
  let component: DeviceOrderAisNewRegisterQrCodeResultPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisNewRegisterQrCodeResultPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisNewRegisterQrCodeResultPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisNewRegisterQrCodeResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
