import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSharePlanMnpSelectReasonPageComponent } from './new-share-plan-mnp-select-reason-page.component';

describe('NewSharePlanMnpSelectReasonPageComponent', () => {
  let component: NewSharePlanMnpSelectReasonPageComponent;
  let fixture: ComponentFixture<NewSharePlanMnpSelectReasonPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSharePlanMnpSelectReasonPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSharePlanMnpSelectReasonPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
