import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNewRegisterSummaryPageComponent } from './order-new-register-summary-page.component';

describe('OrderNewRegisterSummaryPageComponent', () => {
  let component: OrderNewRegisterSummaryPageComponent;
  let fixture: ComponentFixture<OrderNewRegisterSummaryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderNewRegisterSummaryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderNewRegisterSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
