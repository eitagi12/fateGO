import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisMnpFaceCapturePageComponent } from './device-order-ais-mnp-face-capture-page.component';

describe('DeviceOrderAisMnpFaceCapturePageComponent', () => {
  let component: DeviceOrderAisMnpFaceCapturePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisMnpFaceCapturePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisMnpFaceCapturePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisMnpFaceCapturePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
