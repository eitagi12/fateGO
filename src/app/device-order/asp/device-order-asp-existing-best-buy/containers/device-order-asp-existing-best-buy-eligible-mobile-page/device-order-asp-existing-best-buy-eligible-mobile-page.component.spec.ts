import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAspExistingBestBuyEligibleMobilePageComponent } from './device-order-asp-existing-best-buy-eligible-mobile-page.component';

describe('DeviceOrderAspExistingBestBuyEligibleMobilePageComponent', () => {
  let component: DeviceOrderAspExistingBestBuyEligibleMobilePageComponent;
  let fixture: ComponentFixture<DeviceOrderAspExistingBestBuyEligibleMobilePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAspExistingBestBuyEligibleMobilePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAspExistingBestBuyEligibleMobilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
