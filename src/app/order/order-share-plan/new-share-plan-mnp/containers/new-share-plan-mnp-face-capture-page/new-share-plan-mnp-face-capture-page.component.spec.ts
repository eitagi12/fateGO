import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSharePlanMnpFaceCapturePageComponent } from './new-share-plan-mnp-face-capture-page.component';

describe('NewSharePlanMnpFaceCapturePageComponent', () => {
  let component: NewSharePlanMnpFaceCapturePageComponent;
  let fixture: ComponentFixture<NewSharePlanMnpFaceCapturePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSharePlanMnpFaceCapturePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSharePlanMnpFaceCapturePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
