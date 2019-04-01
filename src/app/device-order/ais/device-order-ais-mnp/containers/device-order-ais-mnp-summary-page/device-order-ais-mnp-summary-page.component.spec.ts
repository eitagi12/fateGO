import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisMnpSummaryPageComponent } from './device-order-ais-mnp-summary-page.component';

describe('DeviceOrderAisMnpSummaryPageComponent', () => {
  let component: DeviceOrderAisMnpSummaryPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisMnpSummaryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisMnpSummaryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisMnpSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
