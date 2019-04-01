import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisMnpFaceComparePageComponent } from './device-order-ais-mnp-face-compare-page.component';

describe('DeviceOrderAisMnpFaceComparePageComponent', () => {
  let component: DeviceOrderAisMnpFaceComparePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisMnpFaceComparePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisMnpFaceComparePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisMnpFaceComparePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
