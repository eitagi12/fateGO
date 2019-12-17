import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSharePlanMnpFaceComparePageComponent } from './new-share-plan-mnp-face-compare-page.component';

describe('NewSharePlanMnpFaceComparePageComponent', () => {
  let component: NewSharePlanMnpFaceComparePageComponent;
  let fixture: ComponentFixture<NewSharePlanMnpFaceComparePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSharePlanMnpFaceComparePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSharePlanMnpFaceComparePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
