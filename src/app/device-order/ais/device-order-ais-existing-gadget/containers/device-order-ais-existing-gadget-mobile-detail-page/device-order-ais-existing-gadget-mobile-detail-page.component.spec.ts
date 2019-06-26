import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingGadgetMobileDetailPageComponent } from './device-order-ais-existing-gadget-mobile-detail-page.component';

describe('DeviceOrderAisExistingGadgetMobileDetailPageComponent', () => {
  let component: DeviceOrderAisExistingGadgetMobileDetailPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingGadgetMobileDetailPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingGadgetMobileDetailPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingGadgetMobileDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
