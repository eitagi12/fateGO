import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisPreToPostIdCardCaptureRepiPageComponent } from './device-order-ais-pre-to-post-id-card-capture-repi-page.component';

describe('DeviceOrderAisPreToPostIdCardCaptureRepiPageComponent', () => {
  let component: DeviceOrderAisPreToPostIdCardCaptureRepiPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisPreToPostIdCardCaptureRepiPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisPreToPostIdCardCaptureRepiPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisPreToPostIdCardCaptureRepiPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
