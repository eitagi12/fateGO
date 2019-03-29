import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingBestBuyMobileCareAvailablePageComponent } from './device-order-ais-existing-best-buy-mobile-care-available-page.component';

describe('DeviceOrderAisExistingBestBuyMobileCareAvailablePageComponent', () => {
  let component: DeviceOrderAisExistingBestBuyMobileCareAvailablePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingBestBuyMobileCareAvailablePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingBestBuyMobileCareAvailablePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingBestBuyMobileCareAvailablePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
