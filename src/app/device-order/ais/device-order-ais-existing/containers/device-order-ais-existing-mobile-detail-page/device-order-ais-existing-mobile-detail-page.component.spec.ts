import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingMobileDetailPageComponent } from './device-order-ais-existing-mobile-detail-page.component';

describe('DeviceOrderAisExistingMobileDetailPageComponent', () => {
  let component: DeviceOrderAisExistingMobileDetailPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingMobileDetailPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingMobileDetailPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingMobileDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
