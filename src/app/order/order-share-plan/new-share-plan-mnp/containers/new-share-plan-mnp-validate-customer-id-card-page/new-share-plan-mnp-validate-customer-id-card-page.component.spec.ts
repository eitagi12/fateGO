import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSharePlanMnpValidateCustomerIdCardPageComponent } from './new-share-plan-mnp-validate-customer-id-card-page.component';

describe('NewSharePlanMnpValidateCustomerIdCardPageComponent', () => {
  let component: NewSharePlanMnpValidateCustomerIdCardPageComponent;
  let fixture: ComponentFixture<NewSharePlanMnpValidateCustomerIdCardPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSharePlanMnpValidateCustomerIdCardPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSharePlanMnpValidateCustomerIdCardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
