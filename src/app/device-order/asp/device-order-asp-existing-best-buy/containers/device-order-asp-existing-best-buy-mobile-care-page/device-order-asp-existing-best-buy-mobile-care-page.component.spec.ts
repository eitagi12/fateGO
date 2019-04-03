import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAspExistingBestBuyMobileCarePageComponent } from './device-order-asp-existing-best-buy-mobile-care-page.component';

describe('DeviceOrderAspExistingBestBuyMobileCarePageComponent', () => {
  let component: DeviceOrderAspExistingBestBuyMobileCarePageComponent;
  let fixture: ComponentFixture<DeviceOrderAspExistingBestBuyMobileCarePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAspExistingBestBuyMobileCarePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAspExistingBestBuyMobileCarePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
