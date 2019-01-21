import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingQrCodeGeneratorPageComponent } from './device-order-ais-existing-qr-code-generator-page.component';

describe('DeviceOrderAisExistingQrCodeGeneratorPageComponent', () => {
  let component: DeviceOrderAisExistingQrCodeGeneratorPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingQrCodeGeneratorPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingQrCodeGeneratorPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingQrCodeGeneratorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
