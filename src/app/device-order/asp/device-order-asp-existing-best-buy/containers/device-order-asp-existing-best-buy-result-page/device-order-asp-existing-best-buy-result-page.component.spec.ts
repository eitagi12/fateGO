import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAspExistingBestBuyResultPageComponent } from './device-order-asp-existing-best-buy-result-page.component';

describe('DeviceOrderAspExistingBestBuyResultPageComponent', () => {
  let component: DeviceOrderAspExistingBestBuyResultPageComponent;
  let fixture: ComponentFixture<DeviceOrderAspExistingBestBuyResultPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAspExistingBestBuyResultPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAspExistingBestBuyResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
