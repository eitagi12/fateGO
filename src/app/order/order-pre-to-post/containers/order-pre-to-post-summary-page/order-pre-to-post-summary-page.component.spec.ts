import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPreToPostSummaryPageComponent } from './order-pre-to-post-summary-page.component';

describe('OrderPreToPostSummaryPageComponent', () => {
  let component: OrderPreToPostSummaryPageComponent;
  let fixture: ComponentFixture<OrderPreToPostSummaryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPreToPostSummaryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPreToPostSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
