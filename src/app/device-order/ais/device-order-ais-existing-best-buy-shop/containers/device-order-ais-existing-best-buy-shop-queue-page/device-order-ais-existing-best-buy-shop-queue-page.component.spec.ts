import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingBestBuyShopQueuePageComponent } from './device-order-ais-existing-best-buy-shop-queue-page.component';

describe('DeviceOrderAisExistingBestBuyShopQueuePageComponent', () => {
  let component: DeviceOrderAisExistingBestBuyShopQueuePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingBestBuyShopQueuePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingBestBuyShopQueuePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingBestBuyShopQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
