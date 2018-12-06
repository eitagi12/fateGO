import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNewRegisterVerifyInstantSimPageComponent } from './order-new-register-verify-instant-sim-page.component';

describe('OrderNewRegisterVerifyInstantSimPageComponent', () => {
  let component: OrderNewRegisterVerifyInstantSimPageComponent;
  let fixture: ComponentFixture<OrderNewRegisterVerifyInstantSimPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderNewRegisterVerifyInstantSimPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderNewRegisterVerifyInstantSimPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
