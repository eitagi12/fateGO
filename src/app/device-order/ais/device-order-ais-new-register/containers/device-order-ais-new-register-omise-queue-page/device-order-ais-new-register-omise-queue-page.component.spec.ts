import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisNewRegisterOmiseQueuePageComponent } from './device-order-ais-new-register-omise-queue-page.component';

describe('DeviceOrderAisNewRegisterOmiseQueuePageComponent', () => {
  let component: DeviceOrderAisNewRegisterOmiseQueuePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisNewRegisterOmiseQueuePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisNewRegisterOmiseQueuePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisNewRegisterOmiseQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
