import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisMnpMobileCarePageComponent } from './device-order-ais-mnp-mobile-care-page.component';

describe('DeviceOrderAisMnpMobileCarePageComponent', () => {
  let component: DeviceOrderAisMnpMobileCarePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisMnpMobileCarePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisMnpMobileCarePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisMnpMobileCarePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
