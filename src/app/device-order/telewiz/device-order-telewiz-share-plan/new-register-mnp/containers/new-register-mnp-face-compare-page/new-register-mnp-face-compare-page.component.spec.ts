import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRegisterMnpFaceComparePageComponent } from './new-register-mnp-face-compare-page.component';

describe('NewRegisterMnpFaceComparePageComponent', () => {
  let component: NewRegisterMnpFaceComparePageComponent;
  let fixture: ComponentFixture<NewRegisterMnpFaceComparePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRegisterMnpFaceComparePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRegisterMnpFaceComparePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
