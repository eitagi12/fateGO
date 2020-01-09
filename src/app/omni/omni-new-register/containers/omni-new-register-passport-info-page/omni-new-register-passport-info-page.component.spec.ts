import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmniNewRegisterPassportInfoPageComponent } from './omni-new-register-passport-info-page.component';

describe('OmniNewRegisterPassportInfoPageComponent', () => {
  let component: OmniNewRegisterPassportInfoPageComponent;
  let fixture: ComponentFixture<OmniNewRegisterPassportInfoPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OmniNewRegisterPassportInfoPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OmniNewRegisterPassportInfoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
