import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSharePlanMnpVerifyByPatternPageComponent } from './new-share-plan-mnp-verify-by-pattern-page.component';

describe('NewSharePlanMnpVerifyByPatternPageComponent', () => {
  let component: NewSharePlanMnpVerifyByPatternPageComponent;
  let fixture: ComponentFixture<NewSharePlanMnpVerifyByPatternPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSharePlanMnpVerifyByPatternPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSharePlanMnpVerifyByPatternPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
