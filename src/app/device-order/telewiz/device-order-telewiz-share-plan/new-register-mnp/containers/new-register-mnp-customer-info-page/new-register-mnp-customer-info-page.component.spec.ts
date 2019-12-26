import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRegisterMnpCustomerInfoPageComponent } from './new-register-mnp-customer-info-page.component';

describe('NewRegisterMnpCustomerInfoPageComponent', () => {
  let component: NewRegisterMnpCustomerInfoPageComponent;
  let fixture: ComponentFixture<NewRegisterMnpCustomerInfoPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRegisterMnpCustomerInfoPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRegisterMnpCustomerInfoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
