import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingBestBuyIdcardCaptureRepiPageComponent } from './device-order-ais-existing-best-buy-idcard-capture-repi-page.component';

describe('DeviceOrderAisExistingBestBuyIdcardCaptureRepiPageComponent', () => {
  let component: DeviceOrderAisExistingBestBuyIdcardCaptureRepiPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingBestBuyIdcardCaptureRepiPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingBestBuyIdcardCaptureRepiPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingBestBuyIdcardCaptureRepiPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
