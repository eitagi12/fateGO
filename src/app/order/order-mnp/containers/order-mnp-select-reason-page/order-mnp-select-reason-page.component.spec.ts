import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMnpSelectReasonPageComponent } from './order-mnp-select-reason-page.component';

describe('OrderMnpSelectReasonPageComponent', () => {
  let component: OrderMnpSelectReasonPageComponent;
  let fixture: ComponentFixture<OrderMnpSelectReasonPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderMnpSelectReasonPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderMnpSelectReasonPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
