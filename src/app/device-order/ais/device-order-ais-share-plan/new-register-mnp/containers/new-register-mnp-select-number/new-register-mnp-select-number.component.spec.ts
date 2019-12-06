import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRegisterMnpSelectNumberComponent } from './new-register-mnp-select-number.component';

describe('NewRegisterMnpSelectNumberComponent', () => {
  let component: NewRegisterMnpSelectNumberComponent;
  let fixture: ComponentFixture<NewRegisterMnpSelectNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRegisterMnpSelectNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRegisterMnpSelectNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
