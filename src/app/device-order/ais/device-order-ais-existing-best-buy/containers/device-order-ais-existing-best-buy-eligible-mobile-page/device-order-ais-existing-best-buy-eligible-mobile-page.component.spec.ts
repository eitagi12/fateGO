import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingBestBuyEligibleMobilePageComponent } from './device-order-ais-existing-best-buy-eligible-mobile-page.component';

describe('DeviceOrderAisExistingBestBuyEligibleMobilePageComponent', () => {
  let component: DeviceOrderAisExistingBestBuyEligibleMobilePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingBestBuyEligibleMobilePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingBestBuyEligibleMobilePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingBestBuyEligibleMobilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
