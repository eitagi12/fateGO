import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingBestBuyCustomerInfoPageComponent } from './device-order-ais-existing-best-buy-customer-info-page.component';

describe('DeviceOrderAisExistingBestBuyCustomerInfoPageComponent', () => {
  let component: DeviceOrderAisExistingBestBuyCustomerInfoPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingBestBuyCustomerInfoPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingBestBuyCustomerInfoPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingBestBuyCustomerInfoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
