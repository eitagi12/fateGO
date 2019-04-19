import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingQueuePageComponent } from './device-order-ais-existing-queue-page.component';

describe('DeviceOrderAisExistingQueuePageComponent', () => {
  let component: DeviceOrderAisExistingQueuePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingQueuePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingQueuePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
