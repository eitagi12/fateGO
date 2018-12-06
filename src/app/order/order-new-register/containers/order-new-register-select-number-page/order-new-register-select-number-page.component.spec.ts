import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNewRegisterSelectNumberPageComponent } from './order-new-register-select-number-page.component';

describe('OrderNewRegisterSelectNumberPageComponent', () => {
  let component: OrderNewRegisterSelectNumberPageComponent;
  let fixture: ComponentFixture<OrderNewRegisterSelectNumberPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderNewRegisterSelectNumberPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderNewRegisterSelectNumberPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
