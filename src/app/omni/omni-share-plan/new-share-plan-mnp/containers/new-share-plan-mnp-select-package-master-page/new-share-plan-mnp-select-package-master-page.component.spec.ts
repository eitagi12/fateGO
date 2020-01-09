import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSharePlanMnpSelectPackageMasterPageComponent } from './new-share-plan-mnp-select-package-master-page.component';

describe('NewSharePlanMnpSelectPackageMasterPageComponent', () => {
  let component: NewSharePlanMnpSelectPackageMasterPageComponent;
  let fixture: ComponentFixture<NewSharePlanMnpSelectPackageMasterPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSharePlanMnpSelectPackageMasterPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSharePlanMnpSelectPackageMasterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
