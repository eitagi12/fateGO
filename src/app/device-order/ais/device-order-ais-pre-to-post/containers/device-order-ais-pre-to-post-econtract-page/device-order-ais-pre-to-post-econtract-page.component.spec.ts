import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisPreToPostEcontractPageComponent } from './device-order-ais-pre-to-post-econtract-page.component';

describe('DeviceOrderAisPreToPostEcontractPageComponent', () => {
  let component: DeviceOrderAisPreToPostEcontractPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisPreToPostEcontractPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisPreToPostEcontractPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisPreToPostEcontractPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
