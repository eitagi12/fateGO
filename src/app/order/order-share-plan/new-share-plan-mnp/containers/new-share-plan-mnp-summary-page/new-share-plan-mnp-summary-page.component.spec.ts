import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSharePlanMnpSummaryPageComponent } from './new-share-plan-mnp-summary-page.component';

describe('NewSharePlanMnpSummaryPageComponent', () => {
  let component: NewSharePlanMnpSummaryPageComponent;
  let fixture: ComponentFixture<NewSharePlanMnpSummaryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSharePlanMnpSummaryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSharePlanMnpSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
