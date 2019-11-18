import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisPreToPostOmiseSummaryPageComponent } from './device-order-ais-pre-to-post-omise-summary-page.component';

describe('DeviceOrderAisPreToPostOmiseSummaryPageComponent', () => {
  let component: DeviceOrderAisPreToPostOmiseSummaryPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisPreToPostOmiseSummaryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisPreToPostOmiseSummaryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisPreToPostOmiseSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
