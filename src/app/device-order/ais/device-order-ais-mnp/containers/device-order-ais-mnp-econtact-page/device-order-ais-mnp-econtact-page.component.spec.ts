import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisMnpEcontactPageComponent } from './device-order-ais-mnp-econtact-page.component';

describe('DeviceOrderAisMnpEcontactPageComponent', () => {
  let component: DeviceOrderAisMnpEcontactPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisMnpEcontactPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisMnpEcontactPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisMnpEcontactPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
