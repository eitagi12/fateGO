import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingBestBuyResultPageComponent } from './device-order-ais-existing-best-buy-result-page.component';

describe('DeviceOrderAisExistingBestBuyResultPageComponent', () => {
  let component: DeviceOrderAisExistingBestBuyResultPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingBestBuyResultPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingBestBuyResultPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingBestBuyResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
