import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisMnpPersoSimPageComponent } from './device-order-ais-mnp-perso-sim-page.component';

describe('DeviceOrderAisMnpPersoSimPageComponent', () => {
  let component: DeviceOrderAisMnpPersoSimPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisMnpPersoSimPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisMnpPersoSimPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisMnpPersoSimPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
