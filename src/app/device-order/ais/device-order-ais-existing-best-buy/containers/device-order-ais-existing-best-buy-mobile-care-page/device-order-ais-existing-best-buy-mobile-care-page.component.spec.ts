import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingBestBuyMobileCarePageComponent } from './device-order-ais-existing-best-buy-mobile-care-page.component';

describe('DeviceOrderAisExistingBestBuyMobileCarePageComponent', () => {
  let component: DeviceOrderAisExistingBestBuyMobileCarePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingBestBuyMobileCarePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingBestBuyMobileCarePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingBestBuyMobileCarePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
