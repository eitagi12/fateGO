import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAspExistingBestBuyQueuePageComponent } from './device-order-asp-existing-best-buy-queue-page.component';

describe('DeviceOrderAspExistingBestBuyQueuePageComponent', () => {
  let component: DeviceOrderAspExistingBestBuyQueuePageComponent;
  let fixture: ComponentFixture<DeviceOrderAspExistingBestBuyQueuePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAspExistingBestBuyQueuePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAspExistingBestBuyQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
