import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRegisterMnpMobileCarePageComponent } from './new-register-mnp-mobile-care-page.component';

describe('NewRegisterMnpMobileCarePageComponent', () => {
  let component: NewRegisterMnpMobileCarePageComponent;
  let fixture: ComponentFixture<NewRegisterMnpMobileCarePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRegisterMnpMobileCarePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRegisterMnpMobileCarePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
