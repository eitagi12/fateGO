import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingGadgetOmiseQueuePageComponent } from './device-order-ais-existing-gadget-omise-queue-page.component';

describe('DeviceOrderAisExistingGadgetOmiseQueuePageComponent', () => {
  let component: DeviceOrderAisExistingGadgetOmiseQueuePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingGadgetOmiseQueuePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingGadgetOmiseQueuePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingGadgetOmiseQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
