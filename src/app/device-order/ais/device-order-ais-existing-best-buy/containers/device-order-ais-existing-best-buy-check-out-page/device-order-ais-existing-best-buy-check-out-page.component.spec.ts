import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingBestBuyCheckOutPageComponent } from './device-order-ais-existing-best-buy-check-out-page.component';

describe('DeviceOrderAisExistingBestBuyCheckOutPageComponent', () => {
  let component: DeviceOrderAisExistingBestBuyCheckOutPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingBestBuyCheckOutPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingBestBuyCheckOutPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingBestBuyCheckOutPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
