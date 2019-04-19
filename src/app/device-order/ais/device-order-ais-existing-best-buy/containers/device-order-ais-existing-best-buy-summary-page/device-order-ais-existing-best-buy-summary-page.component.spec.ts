import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingBestBuySummaryPageComponent } from './device-order-ais-existing-best-buy-summary-page.component';

describe('DeviceOrderAisExistingBestBuySummaryPageComponent', () => {
  let component: DeviceOrderAisExistingBestBuySummaryPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingBestBuySummaryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingBestBuySummaryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingBestBuySummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
