import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRegisterMnpEapplicationPageComponent } from './new-register-mnp-eapplication-page.component';

describe('NewRegisterMnpEapplicationPageComponent', () => {
  let component: NewRegisterMnpEapplicationPageComponent;
  let fixture: ComponentFixture<NewRegisterMnpEapplicationPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRegisterMnpEapplicationPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRegisterMnpEapplicationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
