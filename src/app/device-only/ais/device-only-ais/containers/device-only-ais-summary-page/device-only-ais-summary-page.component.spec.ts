import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOnlyAisSummaryPageComponent } from './device-only-ais-summary-page.component';

describe('DeviceOnlyAisSummaryPageComponent', () => {
  let component: DeviceOnlyAisSummaryPageComponent;
  let fixture: ComponentFixture<DeviceOnlyAisSummaryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOnlyAisSummaryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyAisSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
