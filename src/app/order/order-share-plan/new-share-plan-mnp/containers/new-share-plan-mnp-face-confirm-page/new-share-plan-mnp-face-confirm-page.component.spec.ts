import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSharePlanMnpFaceConfirmPageComponent } from './new-share-plan-mnp-face-confirm-page.component';

describe('NewSharePlanMnpFaceConfirmPageComponent', () => {
  let component: NewSharePlanMnpFaceConfirmPageComponent;
  let fixture: ComponentFixture<NewSharePlanMnpFaceConfirmPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSharePlanMnpFaceConfirmPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSharePlanMnpFaceConfirmPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
