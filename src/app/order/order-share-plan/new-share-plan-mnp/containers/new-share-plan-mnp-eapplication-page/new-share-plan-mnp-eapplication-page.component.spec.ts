import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSharePlanMnpEapplicationPageComponent } from './new-share-plan-mnp-eapplication-page.component';

describe('NewSharePlanMnpEapplicationPageComponent', () => {
  let component: NewSharePlanMnpEapplicationPageComponent;
  let fixture: ComponentFixture<NewSharePlanMnpEapplicationPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSharePlanMnpEapplicationPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSharePlanMnpEapplicationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
