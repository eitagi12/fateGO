import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingBestBuyShopOmiseQueuePageComponent } from './device-order-ais-existing-best-buy-shop-omise-queue-page.component';

describe('DeviceOrderAisExistingBestBuyShopOmiseQueuePageComponent', () => {
  let component: DeviceOrderAisExistingBestBuyShopOmiseQueuePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingBestBuyShopOmiseQueuePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingBestBuyShopOmiseQueuePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingBestBuyShopOmiseQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
