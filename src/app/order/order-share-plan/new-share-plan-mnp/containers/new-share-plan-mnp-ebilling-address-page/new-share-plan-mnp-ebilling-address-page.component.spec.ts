import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSharePlanMnpEbillingAddressPageComponent } from './new-share-plan-mnp-ebilling-address-page.component';

describe('NewSharePlanMnpEbillingAddressPageComponent', () => {
  let component: NewSharePlanMnpEbillingAddressPageComponent;
  let fixture: ComponentFixture<NewSharePlanMnpEbillingAddressPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSharePlanMnpEbillingAddressPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSharePlanMnpEbillingAddressPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
