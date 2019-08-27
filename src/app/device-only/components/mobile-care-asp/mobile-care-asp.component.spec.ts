import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileCareAspComponent } from './mobile-care-asp.component';

describe('MobileCareAspComponent', () => {
  let component: MobileCareAspComponent;
  let fixture: ComponentFixture<MobileCareAspComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileCareAspComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileCareAspComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
