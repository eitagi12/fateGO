import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSharePlanMnpPersoSimNewPageComponent } from './new-share-plan-mnp-perso-sim-new-page.component';

describe('NewSharePlanMnpPersoSimNewPageComponent', () => {
  let component: NewSharePlanMnpPersoSimNewPageComponent;
  let fixture: ComponentFixture<NewSharePlanMnpPersoSimNewPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSharePlanMnpPersoSimNewPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSharePlanMnpPersoSimNewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
