import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingOmiseSummaryPageComponent } from './device-order-ais-existing-omise-summary-page.component';

describe('DeviceOrderAisExistingOmiseSummaryPageComponent', () => {
  let component: DeviceOrderAisExistingOmiseSummaryPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingOmiseSummaryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingOmiseSummaryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingOmiseSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
