import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNewRegisterByPatternPageComponent } from './order-new-register-by-pattern-page.component';

describe('OrderNewRegisterByPatternPageComponent', () => {
  let component: OrderNewRegisterByPatternPageComponent;
  let fixture: ComponentFixture<OrderNewRegisterByPatternPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderNewRegisterByPatternPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderNewRegisterByPatternPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
