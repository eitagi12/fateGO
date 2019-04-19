import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisPreToPostAggregatePageComponent } from './device-order-ais-pre-to-post-aggregate-page.component';

describe('DeviceOrderAisPreToPostAggregatePageComponent', () => {
  let component: DeviceOrderAisPreToPostAggregatePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisPreToPostAggregatePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisPreToPostAggregatePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisPreToPostAggregatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
