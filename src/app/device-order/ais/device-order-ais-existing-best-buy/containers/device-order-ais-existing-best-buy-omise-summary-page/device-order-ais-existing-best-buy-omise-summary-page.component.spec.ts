import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingBestBuyOmiseSummaryPageComponent } from './device-order-ais-existing-best-buy-omise-summary-page.component';

describe('DeviceOrderAisExistingBestBuyOmiseSummaryPageComponent', () => {
  let component: DeviceOrderAisExistingBestBuyOmiseSummaryPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingBestBuyOmiseSummaryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingBestBuyOmiseSummaryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingBestBuyOmiseSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
