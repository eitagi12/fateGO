import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRegisterMnpVerifyInstantSimPageComponent } from './new-register-mnp-verify-instant-sim-page.component';

describe('NewRegisterMnpVerifyInstantSimPageComponent', () => {
  let component: NewRegisterMnpVerifyInstantSimPageComponent;
  let fixture: ComponentFixture<NewRegisterMnpVerifyInstantSimPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRegisterMnpVerifyInstantSimPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRegisterMnpVerifyInstantSimPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
