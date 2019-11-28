import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSharePlanMnpResultPageComponent } from './new-share-plan-mnp-result-page.component';

describe('NewSharePlanMnpResultPageComponent', () => {
  let component: NewSharePlanMnpResultPageComponent;
  let fixture: ComponentFixture<NewSharePlanMnpResultPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSharePlanMnpResultPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSharePlanMnpResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
