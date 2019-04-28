import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingBestBuyShopResultPageComponent } from './device-order-ais-existing-best-buy-shop-result-page.component';

describe('DeviceOrderAisExistingBestBuyShopResultPageComponent', () => {
  let component: DeviceOrderAisExistingBestBuyShopResultPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingBestBuyShopResultPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingBestBuyShopResultPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingBestBuyShopResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
