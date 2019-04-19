import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingBestBuyQueuePageComponent } from './device-order-ais-existing-best-buy-queue-page.component';

describe('DeviceOrderAisExistingBestBuyQueuePageComponent', () => {
  let component: DeviceOrderAisExistingBestBuyQueuePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingBestBuyQueuePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingBestBuyQueuePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingBestBuyQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
