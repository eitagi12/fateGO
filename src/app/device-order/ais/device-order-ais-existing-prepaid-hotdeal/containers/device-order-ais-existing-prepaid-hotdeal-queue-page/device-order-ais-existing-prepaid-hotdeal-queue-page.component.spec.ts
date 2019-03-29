import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingPrepaidHotdealQueuePageComponent } from './device-order-ais-existing-prepaid-hotdeal-queue-page.component';

describe('DeviceOrderAisExistingPrepaidHotdealQueuePageComponent', () => {
  let component: DeviceOrderAisExistingPrepaidHotdealQueuePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingPrepaidHotdealQueuePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingPrepaidHotdealQueuePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingPrepaidHotdealQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
