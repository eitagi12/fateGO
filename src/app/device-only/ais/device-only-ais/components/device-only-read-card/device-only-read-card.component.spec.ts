import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOnlyReadCardComponent } from './device-only-read-card.component';

describe('DeviceOnlyReadCardComponent', () => {
  let component: DeviceOnlyReadCardComponent;
  let fixture: ComponentFixture<DeviceOnlyReadCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOnlyReadCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyReadCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
