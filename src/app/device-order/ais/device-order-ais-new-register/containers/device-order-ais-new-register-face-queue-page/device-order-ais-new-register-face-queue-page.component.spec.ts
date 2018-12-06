import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisNewRegisterFaceQueuePageComponent } from './device-order-ais-new-register-face-queue-page.component';

describe('DeviceOrderAisNewRegisterFaceQueuePageComponent', () => {
  let component: DeviceOrderAisNewRegisterFaceQueuePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisNewRegisterFaceQueuePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisNewRegisterFaceQueuePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisNewRegisterFaceQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
