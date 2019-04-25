import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisMnpMobileCareAvaliblePageComponent } from './device-order-ais-mnp-mobile-care-avalible-page.component';

describe('DeviceOrderAisMnpMobileCareAvaliblePageComponent', () => {
  let component: DeviceOrderAisMnpMobileCareAvaliblePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisMnpMobileCareAvaliblePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisMnpMobileCareAvaliblePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisMnpMobileCareAvaliblePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
