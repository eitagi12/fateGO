import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPreToPostEbillingPageComponent } from './order-pre-to-post-ebilling-page.component';

describe('OrderPreToPostEbillingPageComponent', () => {
  let component: OrderPreToPostEbillingPageComponent;
  let fixture: ComponentFixture<OrderPreToPostEbillingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPreToPostEbillingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPreToPostEbillingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
