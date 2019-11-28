import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSharePlanMnpValidateCustomerPageComponent } from './new-share-plan-mnp-validate-customer-page.component';

describe('NewSharePlanMnpValidateCustomerPageComponent', () => {
  let component: NewSharePlanMnpValidateCustomerPageComponent;
  let fixture: ComponentFixture<NewSharePlanMnpValidateCustomerPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSharePlanMnpValidateCustomerPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSharePlanMnpValidateCustomerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
