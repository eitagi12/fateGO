import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisPreToPostSummaryPageComponent } from './device-order-ais-pre-to-post-summary-page.component';

describe('DeviceOrderAisPreToPostSummaryPageComponent', () => {
  let component: DeviceOrderAisPreToPostSummaryPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisPreToPostSummaryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisPreToPostSummaryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisPreToPostSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
