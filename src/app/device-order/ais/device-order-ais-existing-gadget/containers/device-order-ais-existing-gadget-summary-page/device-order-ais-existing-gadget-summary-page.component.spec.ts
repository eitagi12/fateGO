import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingGadgetSummaryPageComponent } from './device-order-ais-existing-gadget-summary-page.component';

describe('DeviceOrderAisExistingGadgetSummaryPageComponent', () => {
  let component: DeviceOrderAisExistingGadgetSummaryPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingGadgetSummaryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingGadgetSummaryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingGadgetSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
