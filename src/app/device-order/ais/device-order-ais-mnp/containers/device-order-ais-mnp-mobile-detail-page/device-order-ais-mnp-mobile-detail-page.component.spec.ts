import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisMnpMobileDetailPageComponent } from './device-order-ais-mnp-mobile-detail-page.component';

describe('DeviceOrderAisMnpMobileDetailPageComponent', () => {
  let component: DeviceOrderAisMnpMobileDetailPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisMnpMobileDetailPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisMnpMobileDetailPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisMnpMobileDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
