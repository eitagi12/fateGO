import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingSummaryPageComponent } from './device-order-ais-existing-summary-page.component';

describe('DeviceOrderAisExistingSummaryPageComponent', () => {
  let component: DeviceOrderAisExistingSummaryPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingSummaryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingSummaryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
