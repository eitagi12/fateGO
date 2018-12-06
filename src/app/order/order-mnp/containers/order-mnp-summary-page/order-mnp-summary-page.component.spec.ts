import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMnpSummaryPageComponent } from './order-mnp-summary-page.component';

describe('OrderMnpSummaryPageComponent', () => {
  let component: OrderMnpSummaryPageComponent;
  let fixture: ComponentFixture<OrderMnpSummaryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderMnpSummaryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderMnpSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
