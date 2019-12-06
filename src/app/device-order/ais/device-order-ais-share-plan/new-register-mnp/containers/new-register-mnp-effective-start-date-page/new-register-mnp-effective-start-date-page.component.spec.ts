import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRegisterMnpEffectiveStartDatePageComponent } from './new-register-mnp-effective-start-date-page.component';

describe('NewRegisterMnpEffectiveStartDatePageComponent', () => {
  let component: NewRegisterMnpEffectiveStartDatePageComponent;
  let fixture: ComponentFixture<NewRegisterMnpEffectiveStartDatePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRegisterMnpEffectiveStartDatePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRegisterMnpEffectiveStartDatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
