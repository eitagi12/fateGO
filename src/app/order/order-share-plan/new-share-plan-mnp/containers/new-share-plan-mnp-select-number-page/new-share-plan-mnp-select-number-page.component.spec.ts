import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSharePlanMnpSelectNumberPageComponent } from './new-share-plan-mnp-select-number-page.component';

describe('NewSharePlanMnpSelectNumberPageComponent', () => {
  let component: NewSharePlanMnpSelectNumberPageComponent;
  let fixture: ComponentFixture<NewSharePlanMnpSelectNumberPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSharePlanMnpSelectNumberPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSharePlanMnpSelectNumberPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
