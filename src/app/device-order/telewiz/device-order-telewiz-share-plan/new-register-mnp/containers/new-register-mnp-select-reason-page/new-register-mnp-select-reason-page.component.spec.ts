import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRegisterMnpSelectReasonPageComponent } from './new-register-mnp-select-reason-page.component';

describe('NewRegisterMnpSelectReasonPageComponent', () => {
  let component: NewRegisterMnpSelectReasonPageComponent;
  let fixture: ComponentFixture<NewRegisterMnpSelectReasonPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRegisterMnpSelectReasonPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRegisterMnpSelectReasonPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
