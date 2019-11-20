import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingOmiseQueuePageComponent } from './device-order-ais-existing-omise-queue-page.component';

describe('DeviceOrderAisExistingOmiseQueuePageComponent', () => {
  let component: DeviceOrderAisExistingOmiseQueuePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingOmiseQueuePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingOmiseQueuePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingOmiseQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
