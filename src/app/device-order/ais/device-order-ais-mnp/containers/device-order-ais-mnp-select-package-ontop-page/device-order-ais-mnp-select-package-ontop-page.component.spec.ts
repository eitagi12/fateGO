import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisMnpSelectPackageOntopPageComponent } from './device-order-ais-mnp-select-package-ontop-page.component';

describe('DeviceOrderAisMnpSelectPackageOntopPageComponent', () => {
  let component: DeviceOrderAisMnpSelectPackageOntopPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisMnpSelectPackageOntopPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisMnpSelectPackageOntopPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisMnpSelectPackageOntopPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
