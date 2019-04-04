import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAspExistingBestBuyMobileCareAvailablePageComponent } from './device-order-asp-existing-best-buy-mobile-care-available-page.component';

describe('DeviceOrderAspExistingBestBuyMobileCareAvailablePageComponent', () => {
  let component: DeviceOrderAspExistingBestBuyMobileCareAvailablePageComponent;
  let fixture: ComponentFixture<DeviceOrderAspExistingBestBuyMobileCareAvailablePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAspExistingBestBuyMobileCareAvailablePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAspExistingBestBuyMobileCareAvailablePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
