import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSharePlanMnpAgreementSignPageComponent } from './new-share-plan-mnp-agreement-sign-page.component';

describe('NewSharePlanMnpAgreementSignPageComponent', () => {
  let component: NewSharePlanMnpAgreementSignPageComponent;
  let fixture: ComponentFixture<NewSharePlanMnpAgreementSignPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSharePlanMnpAgreementSignPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSharePlanMnpAgreementSignPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
