import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisMnpOmiseQueuePageComponent } from './device-order-ais-mnp-omise-queue-page.component';

describe('DeviceOrderAisMnpOmiseQueuePageComponent', () => {
  let component: DeviceOrderAisMnpOmiseQueuePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisMnpOmiseQueuePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisMnpOmiseQueuePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisMnpOmiseQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
