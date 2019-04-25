import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingMobileCarePageComponent } from './device-order-ais-existing-mobile-care-page.component';

describe('DeviceOrderAisExistingMobileCarePageComponent', () => {
  let component: DeviceOrderAisExistingMobileCarePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingMobileCarePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingMobileCarePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingMobileCarePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
