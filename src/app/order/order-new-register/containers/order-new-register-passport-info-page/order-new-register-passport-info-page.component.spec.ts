import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNewRegisterPassportInfoPageComponent } from './order-new-register-passport-info-page.component';

describe('OrderNewRegisterPassportInfoPageComponent', () => {
  let component: OrderNewRegisterPassportInfoPageComponent;
  let fixture: ComponentFixture<OrderNewRegisterPassportInfoPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderNewRegisterPassportInfoPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderNewRegisterPassportInfoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
