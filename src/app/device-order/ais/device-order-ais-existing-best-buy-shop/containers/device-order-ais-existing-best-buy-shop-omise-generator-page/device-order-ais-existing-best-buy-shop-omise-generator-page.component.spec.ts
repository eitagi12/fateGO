import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingBestBuyShopOmiseGeneratorPageComponent } from './device-order-ais-existing-best-buy-shop-omise-generator-page.component';

describe('DeviceOrderAisExistingBestBuyShopOmiseGeneratorPageComponent', () => {
  let component: DeviceOrderAisExistingBestBuyShopOmiseGeneratorPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingBestBuyShopOmiseGeneratorPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingBestBuyShopOmiseGeneratorPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingBestBuyShopOmiseGeneratorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
