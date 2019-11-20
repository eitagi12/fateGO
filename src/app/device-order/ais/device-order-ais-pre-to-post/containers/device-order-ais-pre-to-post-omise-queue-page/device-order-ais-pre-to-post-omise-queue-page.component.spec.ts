import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisPreToPostOmiseQueuePageComponent } from './device-order-ais-pre-to-post-omise-queue-page.component';

describe('DeviceOrderAisPreToPostOmiseQueuePageComponent', () => {
  let component: DeviceOrderAisPreToPostOmiseQueuePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisPreToPostOmiseQueuePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisPreToPostOmiseQueuePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisPreToPostOmiseQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
