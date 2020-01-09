import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmniNewRegisterVerifyDocumentPageComponent } from './omni-new-register-verify-document-page.component';

describe('OmniNewRegisterVerifyDocumentPageComponent', () => {
  let component: OmniNewRegisterVerifyDocumentPageComponent;
  let fixture: ComponentFixture<OmniNewRegisterVerifyDocumentPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OmniNewRegisterVerifyDocumentPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OmniNewRegisterVerifyDocumentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
