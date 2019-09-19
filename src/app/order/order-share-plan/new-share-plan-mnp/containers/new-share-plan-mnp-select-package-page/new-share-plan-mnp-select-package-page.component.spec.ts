import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSharePlanMnpSelectPackagePageComponent } from './new-share-plan-mnp-select-package-page.component';

describe('NewSharePlanMnpSelectPackagePageComponent', () => {
  let component: NewSharePlanMnpSelectPackagePageComponent;
  let fixture: ComponentFixture<NewSharePlanMnpSelectPackagePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSharePlanMnpSelectPackagePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSharePlanMnpSelectPackagePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
