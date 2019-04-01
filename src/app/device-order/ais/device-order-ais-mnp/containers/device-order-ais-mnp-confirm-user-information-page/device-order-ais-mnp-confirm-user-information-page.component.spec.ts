import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisMnpConfirmUserInformationPageComponent } from './device-order-ais-mnp-confirm-user-information-page.component';

describe('DeviceOrderAisMnpConfirmUserInformationPageComponent', () => {
  let component: DeviceOrderAisMnpConfirmUserInformationPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisMnpConfirmUserInformationPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisMnpConfirmUserInformationPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisMnpConfirmUserInformationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
