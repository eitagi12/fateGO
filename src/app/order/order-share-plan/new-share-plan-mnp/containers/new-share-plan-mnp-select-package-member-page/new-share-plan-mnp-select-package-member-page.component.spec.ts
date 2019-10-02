import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSharePlanMnpSelectPackageMemberPageComponent } from './new-share-plan-mnp-select-package-member-page.component';

describe('NewSharePlanMnpSelectPackageMemberPageComponent', () => {
  let component: NewSharePlanMnpSelectPackageMemberPageComponent;
  let fixture: ComponentFixture<NewSharePlanMnpSelectPackageMemberPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSharePlanMnpSelectPackageMemberPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSharePlanMnpSelectPackageMemberPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
