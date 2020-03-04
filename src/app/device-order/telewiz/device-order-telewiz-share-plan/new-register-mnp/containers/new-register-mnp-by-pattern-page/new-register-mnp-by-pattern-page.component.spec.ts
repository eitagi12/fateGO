import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRegisterMnpByPatternPageComponent } from './new-register-mnp-by-pattern-page.component';

describe('NewRegisterMnpByPatternPageComponent', () => {
  let component: NewRegisterMnpByPatternPageComponent;
  let fixture: ComponentFixture<NewRegisterMnpByPatternPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRegisterMnpByPatternPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRegisterMnpByPatternPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
