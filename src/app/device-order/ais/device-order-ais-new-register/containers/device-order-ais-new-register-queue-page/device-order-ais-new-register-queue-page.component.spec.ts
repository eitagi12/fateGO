import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisNewRegisterQueuePageComponent } from './device-order-ais-new-register-queue-page.component';

describe('DeviceOrderAisNewRegisterQueuePageComponent', () => {
  let component: DeviceOrderAisNewRegisterQueuePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisNewRegisterQueuePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisNewRegisterQueuePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisNewRegisterQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
