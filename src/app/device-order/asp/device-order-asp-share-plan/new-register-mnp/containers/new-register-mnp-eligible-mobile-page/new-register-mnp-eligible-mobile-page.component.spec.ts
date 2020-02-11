import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRegisterMnpEligibleMobilePageComponent } from './new-register-mnp-eligible-mobile-page.component';

describe('NewRegisterMnpEligibleMobilePageComponent', () => {
  let component: NewRegisterMnpEligibleMobilePageComponent;
  let fixture: ComponentFixture<NewRegisterMnpEligibleMobilePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRegisterMnpEligibleMobilePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRegisterMnpEligibleMobilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
