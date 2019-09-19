import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSharePlanMnpValidateCustomerKeyInPageComponent } from './new-share-plan-mnp-validate-customer-key-in-page.component';

describe('NewSharePlanMnpValidateCustomerKeyInPageComponent', () => {
  let component: NewSharePlanMnpValidateCustomerKeyInPageComponent;
  let fixture: ComponentFixture<NewSharePlanMnpValidateCustomerKeyInPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSharePlanMnpValidateCustomerKeyInPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSharePlanMnpValidateCustomerKeyInPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
