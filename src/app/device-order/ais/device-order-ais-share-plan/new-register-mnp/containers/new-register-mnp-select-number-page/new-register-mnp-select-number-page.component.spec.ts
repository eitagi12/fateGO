import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRegisterMnpSelectNumberPageComponent } from './new-register-mnp-select-number-page.component';

describe('NewRegisterMnpSelectNumberPageComponent', () => {
  let component: NewRegisterMnpSelectNumberPageComponent;
  let fixture: ComponentFixture<NewRegisterMnpSelectNumberPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRegisterMnpSelectNumberPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRegisterMnpSelectNumberPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
