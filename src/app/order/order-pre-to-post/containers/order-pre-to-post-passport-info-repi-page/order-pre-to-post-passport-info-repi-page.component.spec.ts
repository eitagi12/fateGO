import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPreToPostPassportInfoRepiPageComponent } from './order-pre-to-post-passport-info-repi-page.component';

describe('OrderPreToPostPassportInfoRepiPageComponent', () => {
  let component: OrderPreToPostPassportInfoRepiPageComponent;
  let fixture: ComponentFixture<OrderPreToPostPassportInfoRepiPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPreToPostPassportInfoRepiPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPreToPostPassportInfoRepiPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
