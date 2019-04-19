import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisNewRegisterQrCodeGeneratorPageComponent } from './device-order-ais-new-register-qr-code-generator-page.component';

describe('DeviceOrderAisNewRegisterQrCodeGeneratorPageComponent', () => {
  let component: DeviceOrderAisNewRegisterQrCodeGeneratorPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisNewRegisterQrCodeGeneratorPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisNewRegisterQrCodeGeneratorPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisNewRegisterQrCodeGeneratorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
