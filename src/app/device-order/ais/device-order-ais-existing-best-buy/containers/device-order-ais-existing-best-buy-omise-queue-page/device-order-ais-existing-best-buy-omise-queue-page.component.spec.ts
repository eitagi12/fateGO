import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingBestBuyOmiseQueuePageComponent } from './device-order-ais-existing-best-buy-omise-queue-page.component';

describe('DeviceOrderAisExistingBestBuyOmiseQueuePageComponent', () => {
  let component: DeviceOrderAisExistingBestBuyOmiseQueuePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingBestBuyOmiseQueuePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingBestBuyOmiseQueuePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingBestBuyOmiseQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
