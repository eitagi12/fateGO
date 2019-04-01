import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisMnpFaceConfirmPageComponent } from './device-order-ais-mnp-face-confirm-page.component';

describe('DeviceOrderAisMnpFaceConfirmPageComponent', () => {
  let component: DeviceOrderAisMnpFaceConfirmPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisMnpFaceConfirmPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisMnpFaceConfirmPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisMnpFaceConfirmPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
