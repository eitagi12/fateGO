import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRegisterMnpResultPageComponent } from './new-register-mnp-result-page.component';

describe('NewRegisterMnpResultPageComponent', () => {
  let component: NewRegisterMnpResultPageComponent;
  let fixture: ComponentFixture<NewRegisterMnpResultPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRegisterMnpResultPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRegisterMnpResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
