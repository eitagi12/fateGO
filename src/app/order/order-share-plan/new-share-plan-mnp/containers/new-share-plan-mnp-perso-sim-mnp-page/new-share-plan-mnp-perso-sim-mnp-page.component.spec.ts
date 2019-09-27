import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSharePlanMnpPersoSimMnpPageComponent } from './new-share-plan-mnp-perso-sim-mnp-page.component';

describe('NewSharePlanMnpPersoSimMnpPageComponent', () => {
  let component: NewSharePlanMnpPersoSimMnpPageComponent;
  let fixture: ComponentFixture<NewSharePlanMnpPersoSimMnpPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSharePlanMnpPersoSimMnpPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSharePlanMnpPersoSimMnpPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
