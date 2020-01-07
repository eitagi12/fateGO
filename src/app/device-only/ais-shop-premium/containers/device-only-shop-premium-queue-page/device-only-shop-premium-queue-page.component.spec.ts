import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOnlyShopPremiumQueuePageComponent } from './device-only-shop-premium-queue-page.component';

describe('DeviceOnlyShopPremiumQueuePageComponent', () => {
  let component: DeviceOnlyShopPremiumQueuePageComponent;
  let fixture: ComponentFixture<DeviceOnlyShopPremiumQueuePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOnlyShopPremiumQueuePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyShopPremiumQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
