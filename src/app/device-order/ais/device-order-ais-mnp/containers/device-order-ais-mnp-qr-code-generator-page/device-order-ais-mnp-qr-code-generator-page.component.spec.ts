import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisMnpQrCodeGeneratorPageComponent } from './device-order-ais-mnp-qr-code-generator-page.component';

describe('DeviceOrderAisMnpQrCodeGeneratorPageComponent', () => {
  let component: DeviceOrderAisMnpQrCodeGeneratorPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisMnpQrCodeGeneratorPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisMnpQrCodeGeneratorPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisMnpQrCodeGeneratorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
