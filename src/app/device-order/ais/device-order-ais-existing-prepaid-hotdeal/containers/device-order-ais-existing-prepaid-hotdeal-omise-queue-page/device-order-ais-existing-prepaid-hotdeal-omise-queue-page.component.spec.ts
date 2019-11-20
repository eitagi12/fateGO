import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingPrepaidHotdealOmiseQueuePageComponent } from './device-order-ais-existing-prepaid-hotdeal-omise-queue-page.component';

describe('DeviceOrderAisExistingPrepaidHotdealOmiseQueuePageComponent', () => {
  let component: DeviceOrderAisExistingPrepaidHotdealOmiseQueuePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingPrepaidHotdealOmiseQueuePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingPrepaidHotdealOmiseQueuePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingPrepaidHotdealOmiseQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
