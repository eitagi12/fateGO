import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingGadgetOmiseSummaryPageComponent } from './device-order-ais-existing-gadget-omise-summary-page.component';

describe('DeviceOrderAisExistingGadgetOmiseSummaryPageComponent', () => {
  let component: DeviceOrderAisExistingGadgetOmiseSummaryPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingGadgetOmiseSummaryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingGadgetOmiseSummaryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingGadgetOmiseSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
