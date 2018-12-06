import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckingPageComponent } from './checking-page.component';

describe('CheckingPageComponent', () => {
  let component: CheckingPageComponent;
  let fixture: ComponentFixture<CheckingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
