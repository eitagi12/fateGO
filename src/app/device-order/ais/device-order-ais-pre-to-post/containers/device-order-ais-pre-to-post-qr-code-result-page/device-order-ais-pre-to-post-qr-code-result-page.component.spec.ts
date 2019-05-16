import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisPreToPostQrCodeResultPageComponent } from './device-order-ais-pre-to-post-qr-code-result-page.component';

describe('DeviceOrderAisPreToPostQrCodeResultPageComponent', () => {
  let component: DeviceOrderAisPreToPostQrCodeResultPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisPreToPostQrCodeResultPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisPreToPostQrCodeResultPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisPreToPostQrCodeResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
