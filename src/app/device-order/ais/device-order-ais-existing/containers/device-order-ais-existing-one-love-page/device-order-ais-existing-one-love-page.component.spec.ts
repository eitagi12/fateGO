import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingOneLovePageComponent } from './device-order-ais-existing-one-love-page.component';

describe('DeviceOrderAisExistingOneLovePageComponent', () => {
  let component: DeviceOrderAisExistingOneLovePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingOneLovePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingOneLovePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingOneLovePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
