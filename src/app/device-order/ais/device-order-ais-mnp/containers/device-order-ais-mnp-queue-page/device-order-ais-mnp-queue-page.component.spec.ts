import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisMnpQueuePageComponent } from './device-order-ais-mnp-queue-page.component';

describe('DeviceOrderAisMnpQueuePageComponent', () => {
  let component: DeviceOrderAisMnpQueuePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisMnpQueuePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisMnpQueuePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisMnpQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
