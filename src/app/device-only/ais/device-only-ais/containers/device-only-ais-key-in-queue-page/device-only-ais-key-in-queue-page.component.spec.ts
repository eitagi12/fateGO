import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOnlyAisKeyInQueuePageComponent } from './device-only-ais-key-in-queue-page.component';

describe('DeviceOnlyAisKeyInQueuePageComponent', () => {
  let component: DeviceOnlyAisKeyInQueuePageComponent;
  let fixture: ComponentFixture<DeviceOnlyAisKeyInQueuePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOnlyAisKeyInQueuePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyAisKeyInQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
