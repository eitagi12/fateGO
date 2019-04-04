import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisPreToPostQrCodeErrorPageComponent } from './device-order-ais-pre-to-post-qr-code-error-page.component';

describe('DeviceOrderAisPreToPostQrCodeErrorPageComponent', () => {
  let component: DeviceOrderAisPreToPostQrCodeErrorPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisPreToPostQrCodeErrorPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisPreToPostQrCodeErrorPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisPreToPostQrCodeErrorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
