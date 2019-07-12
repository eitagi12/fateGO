import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginWithPinPageComponent } from './login-with-pin-page.component';

describe('LoginWithPinPageComponent', () => {
  let component: LoginWithPinPageComponent;
  let fixture: ComponentFixture<LoginWithPinPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginWithPinPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginWithPinPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
