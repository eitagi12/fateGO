import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingQrCodeResultPageComponent } from './device-order-ais-existing-qr-code-result-page.component';

describe('DeviceOrderAisExistingQrCodeResultPageComponent', () => {
  let component: DeviceOrderAisExistingQrCodeResultPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingQrCodeResultPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingQrCodeResultPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingQrCodeResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
