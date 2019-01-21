import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingAggregatePageComponent } from './device-order-ais-existing-aggregate-page.component';

describe('DeviceOrderAisExistingAggregatePageComponent', () => {
  let component: DeviceOrderAisExistingAggregatePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingAggregatePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingAggregatePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingAggregatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
