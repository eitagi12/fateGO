import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAspExistingBestBuyMobileDetailPageComponent } from './device-order-asp-existing-best-buy-mobile-detail-page.component';

describe('DeviceOrderAspExistingBestBuyMobileDetailPageComponent', () => {
  let component: DeviceOrderAspExistingBestBuyMobileDetailPageComponent;
  let fixture: ComponentFixture<DeviceOrderAspExistingBestBuyMobileDetailPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAspExistingBestBuyMobileDetailPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAspExistingBestBuyMobileDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
