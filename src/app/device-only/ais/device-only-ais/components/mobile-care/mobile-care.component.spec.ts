import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileCareComponent } from './mobile-care.component';

describe('MobileCareComponent', () => {
  let component: MobileCareComponent;
  let fixture: ComponentFixture<MobileCareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileCareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileCareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
