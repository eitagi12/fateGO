import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSharePlanMnpConfirmUserInformationPageComponent } from './new-share-plan-mnp-confirm-user-information-page.component';

describe('NewSharePlanMnpConfirmUserInformationPageComponent', () => {
  let component: NewSharePlanMnpConfirmUserInformationPageComponent;
  let fixture: ComponentFixture<NewSharePlanMnpConfirmUserInformationPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSharePlanMnpConfirmUserInformationPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSharePlanMnpConfirmUserInformationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
