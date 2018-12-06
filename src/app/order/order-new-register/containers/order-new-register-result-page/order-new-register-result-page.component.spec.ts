import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNewRegisterResultPageComponent } from './order-new-register-result-page.component';

describe('OrderNewRegisterResultPageComponent', () => {
  let component: OrderNewRegisterResultPageComponent;
  let fixture: ComponentFixture<OrderNewRegisterResultPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderNewRegisterResultPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderNewRegisterResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
