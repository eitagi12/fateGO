import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisPreToPostAgreementPageComponent } from './device-order-ais-pre-to-post-agreement-page.component';

describe('DeviceOrderAisPreToPostAgreementPageComponent', () => {
  let component: DeviceOrderAisPreToPostAgreementPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisPreToPostAgreementPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisPreToPostAgreementPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisPreToPostAgreementPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
