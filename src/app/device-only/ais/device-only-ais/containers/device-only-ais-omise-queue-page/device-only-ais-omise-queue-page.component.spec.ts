import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOnlyAisOmiseQueuePageComponent } from './device-only-ais-omise-queue-page.component';

describe('DeviceOnlyAisOmiseQueuePageComponent', () => {
  let component: DeviceOnlyAisOmiseQueuePageComponent;
  let fixture: ComponentFixture<DeviceOnlyAisOmiseQueuePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOnlyAisOmiseQueuePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyAisOmiseQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
