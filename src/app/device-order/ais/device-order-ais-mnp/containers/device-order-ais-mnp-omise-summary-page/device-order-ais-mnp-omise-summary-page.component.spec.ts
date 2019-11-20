import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisMnpOmiseSummaryPageComponent } from './device-order-ais-mnp-omise-summary-page.component';

describe('DeviceOrderAisMnpOmiseSummaryPageComponent', () => {
  let component: DeviceOrderAisMnpOmiseSummaryPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisMnpOmiseSummaryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisMnpOmiseSummaryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisMnpOmiseSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
