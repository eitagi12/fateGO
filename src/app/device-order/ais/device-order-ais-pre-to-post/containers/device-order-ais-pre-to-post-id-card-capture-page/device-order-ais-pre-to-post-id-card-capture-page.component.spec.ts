import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisPreToPostIdCardCapturePageComponent } from './device-order-ais-pre-to-post-id-card-capture-page.component';

describe('DeviceOrderAisPreToPostIdCardCapturePageComponent', () => {
  let component: DeviceOrderAisPreToPostIdCardCapturePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisPreToPostIdCardCapturePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisPreToPostIdCardCapturePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisPreToPostIdCardCapturePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
