import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingGadgetQueuePageComponent } from './device-order-ais-existing-gadget-queue-page.component';

describe('DeviceOrderAisExistingGadgetQueuePageComponent', () => {
  let component: DeviceOrderAisExistingGadgetQueuePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingGadgetQueuePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingGadgetQueuePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingGadgetQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
