import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingAgreementPageComponent } from './device-order-ais-existing-agreement-page.component';

describe('DeviceOrderAisExistingAgreementPageComponent', () => {
  let component: DeviceOrderAisExistingAgreementPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingAgreementPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingAgreementPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingAgreementPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
