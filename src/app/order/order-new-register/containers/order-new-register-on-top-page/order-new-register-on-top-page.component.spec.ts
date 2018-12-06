import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNewRegisterOnTopPageComponent } from './order-new-register-on-top-page.component';

describe('OrderNewRegisterOnTopPageComponent', () => {
  let component: OrderNewRegisterOnTopPageComponent;
  let fixture: ComponentFixture<OrderNewRegisterOnTopPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderNewRegisterOnTopPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderNewRegisterOnTopPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
