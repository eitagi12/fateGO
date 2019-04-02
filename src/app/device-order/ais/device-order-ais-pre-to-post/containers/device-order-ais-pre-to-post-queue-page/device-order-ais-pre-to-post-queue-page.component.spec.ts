import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisPreToPostQueuePageComponent } from './device-order-ais-pre-to-post-queue-page.component';

describe('DeviceOrderAisPreToPostQueuePageComponent', () => {
  let component: DeviceOrderAisPreToPostQueuePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisPreToPostQueuePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisPreToPostQueuePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisPreToPostQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
