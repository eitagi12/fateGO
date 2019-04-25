import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAspExistingBestBuyIdcardCaptureRepiPageComponent } from './device-order-asp-existing-best-buy-idcard-capture-repi-page.component';

describe('DeviceOrderAspExistingBestBuyIdcardCaptureRepiPageComponent', () => {
  let component: DeviceOrderAspExistingBestBuyIdcardCaptureRepiPageComponent;
  let fixture: ComponentFixture<DeviceOrderAspExistingBestBuyIdcardCaptureRepiPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAspExistingBestBuyIdcardCaptureRepiPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAspExistingBestBuyIdcardCaptureRepiPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
