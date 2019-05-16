import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisMnpQrCodeResultPageComponent } from './device-order-ais-mnp-qr-code-result-page.component';

describe('DeviceOrderAisMnpQrCodeResultPageComponent', () => {
  let component: DeviceOrderAisMnpQrCodeResultPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisMnpQrCodeResultPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisMnpQrCodeResultPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisMnpQrCodeResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
