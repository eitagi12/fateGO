import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRegisterMnpMobileCareAvaliblePageComponent } from './new-register-mnp-mobile-care-avalible-page.component';

describe('NewRegisterMnpMobileCareAvaliblePageComponent', () => {
  let component: NewRegisterMnpMobileCareAvaliblePageComponent;
  let fixture: ComponentFixture<NewRegisterMnpMobileCareAvaliblePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRegisterMnpMobileCareAvaliblePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRegisterMnpMobileCareAvaliblePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
