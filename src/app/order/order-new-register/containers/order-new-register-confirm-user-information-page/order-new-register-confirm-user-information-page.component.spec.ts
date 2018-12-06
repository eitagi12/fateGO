import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNewRegisterConfirmUserInformationPageComponent } from './order-new-register-confirm-user-information-page.component';

describe('OrderNewRegisterConfirmUserInformationPageComponent', () => {
  let component: OrderNewRegisterConfirmUserInformationPageComponent;
  let fixture: ComponentFixture<OrderNewRegisterConfirmUserInformationPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderNewRegisterConfirmUserInformationPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderNewRegisterConfirmUserInformationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
