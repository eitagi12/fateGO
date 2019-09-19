import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSharePlanMnpPersoSimPageComponent } from './new-share-plan-mnp-perso-sim-page.component';

describe('NewSharePlanMnpPersoSimPageComponent', () => {
  let component: NewSharePlanMnpPersoSimPageComponent;
  let fixture: ComponentFixture<NewSharePlanMnpPersoSimPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSharePlanMnpPersoSimPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSharePlanMnpPersoSimPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
