import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingBestBuyOmiseResultPageComponent } from './device-order-ais-existing-best-buy-omise-result-page.component';

describe('DeviceOrderAisExistingBestBuyOmiseResultPageComponent', () => {
  let component: DeviceOrderAisExistingBestBuyOmiseResultPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingBestBuyOmiseResultPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingBestBuyOmiseResultPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingBestBuyOmiseResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
