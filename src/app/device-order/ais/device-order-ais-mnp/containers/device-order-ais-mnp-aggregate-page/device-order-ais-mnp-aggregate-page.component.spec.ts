import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisMnpAggregatePageComponent } from './device-order-ais-mnp-aggregate-page.component';

describe('DeviceOrderAisMnpAggregatePageComponent', () => {
  let component: DeviceOrderAisMnpAggregatePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisMnpAggregatePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisMnpAggregatePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisMnpAggregatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
