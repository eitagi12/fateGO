import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingBestBuyMobileDetailPageComponent } from './device-order-ais-existing-best-buy-mobile-detail-page.component';

describe('DeviceOrderAisExistingBestBuyMobileDetailPageComponent', () => {
  let component: DeviceOrderAisExistingBestBuyMobileDetailPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingBestBuyMobileDetailPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingBestBuyMobileDetailPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingBestBuyMobileDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
