import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMnpEapplicationPageComponent } from './order-mnp-eapplication-page.component';

describe('OrderMnpEapplicationPageComponent', () => {
  let component: OrderMnpEapplicationPageComponent;
  let fixture: ComponentFixture<OrderMnpEapplicationPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderMnpEapplicationPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderMnpEapplicationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
