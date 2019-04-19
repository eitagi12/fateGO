import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAspExistingBestBuySummaryPageComponent } from './device-order-asp-existing-best-buy-summary-page.component';

describe('DeviceOrderAspExistingBestBuySummaryPageComponent', () => {
  let component: DeviceOrderAspExistingBestBuySummaryPageComponent;
  let fixture: ComponentFixture<DeviceOrderAspExistingBestBuySummaryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAspExistingBestBuySummaryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAspExistingBestBuySummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
