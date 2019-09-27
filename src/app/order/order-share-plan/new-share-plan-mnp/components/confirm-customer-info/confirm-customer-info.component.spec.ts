import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmCustomerInfoComponent } from './confirm-customer-info.component';

describe('ConfirmCustomerInfoComponent', () => {
  let component: ConfirmCustomerInfoComponent;
  let fixture: ComponentFixture<ConfirmCustomerInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmCustomerInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmCustomerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
