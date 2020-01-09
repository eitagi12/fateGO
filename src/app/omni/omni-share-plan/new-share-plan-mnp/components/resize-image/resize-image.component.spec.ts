import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizeImageComponent } from './resize-image.component';

describe('ResizeImageComponent', () => {
  let component: ResizeImageComponent;
  let fixture: ComponentFixture<ResizeImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResizeImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResizeImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
