import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisPreToPostQrCodeGeneratorPageComponent } from './device-order-ais-pre-to-post-qr-code-generator-page.component';

describe('DeviceOrderAisPreToPostQrCodeGeneratorPageComponent', () => {
  let component: DeviceOrderAisPreToPostQrCodeGeneratorPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisPreToPostQrCodeGeneratorPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisPreToPostQrCodeGeneratorPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisPreToPostQrCodeGeneratorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
