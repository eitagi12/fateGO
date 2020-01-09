import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSharePlanMnpCustomerInfoPageComponent } from './new-share-plan-mnp-customer-info-page.component';

describe('NewSharePlanMnpCustomerInfoPageComponent', () => {
  let component: NewSharePlanMnpCustomerInfoPageComponent;
  let fixture: ComponentFixture<NewSharePlanMnpCustomerInfoPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSharePlanMnpCustomerInfoPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSharePlanMnpCustomerInfoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
