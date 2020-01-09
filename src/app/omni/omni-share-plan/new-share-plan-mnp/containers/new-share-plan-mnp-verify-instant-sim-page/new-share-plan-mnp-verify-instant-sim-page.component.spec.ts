import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSharePlanMnpVerifyInstantSimPageComponent } from './new-share-plan-mnp-verify-instant-sim-page.component';

describe('NewSharePlanMnpVerifyInstantSimPageComponent', () => {
  let component: NewSharePlanMnpVerifyInstantSimPageComponent;
  let fixture: ComponentFixture<NewSharePlanMnpVerifyInstantSimPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSharePlanMnpVerifyInstantSimPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSharePlanMnpVerifyInstantSimPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
