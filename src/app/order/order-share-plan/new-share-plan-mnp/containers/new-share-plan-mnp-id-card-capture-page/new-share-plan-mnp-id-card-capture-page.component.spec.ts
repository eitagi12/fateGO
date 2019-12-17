import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSharePlanMnpIdCardCapturePageComponent } from './new-share-plan-mnp-id-card-capture-page.component';

describe('NewSharePlanMnpIdCardCapturePageComponent', () => {
  let component: NewSharePlanMnpIdCardCapturePageComponent;
  let fixture: ComponentFixture<NewSharePlanMnpIdCardCapturePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSharePlanMnpIdCardCapturePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSharePlanMnpIdCardCapturePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
