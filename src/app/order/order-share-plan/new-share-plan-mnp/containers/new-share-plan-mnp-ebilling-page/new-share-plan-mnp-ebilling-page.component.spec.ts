import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSharePlanMnpEbillingPageComponent } from './new-share-plan-mnp-ebilling-page.component';

describe('NewSharePlanMnpEbillingPageComponent', () => {
  let component: NewSharePlanMnpEbillingPageComponent;
  let fixture: ComponentFixture<NewSharePlanMnpEbillingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSharePlanMnpEbillingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSharePlanMnpEbillingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
