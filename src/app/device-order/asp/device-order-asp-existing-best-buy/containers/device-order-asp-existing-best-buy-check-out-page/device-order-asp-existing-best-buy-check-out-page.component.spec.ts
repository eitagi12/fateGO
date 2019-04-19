import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAspExistingBestBuyCheckOutPageComponent } from './device-order-asp-existing-best-buy-check-out-page.component';

describe('DeviceOrderAspExistingBestBuyCheckOutPageComponent', () => {
  let component: DeviceOrderAspExistingBestBuyCheckOutPageComponent;
  let fixture: ComponentFixture<DeviceOrderAspExistingBestBuyCheckOutPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAspExistingBestBuyCheckOutPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAspExistingBestBuyCheckOutPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
