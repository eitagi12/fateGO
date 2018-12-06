import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPreToPostCurrentInfoPageComponent } from './order-pre-to-post-current-info-page.component';

describe('OrderPreToPostCurrentInfoPageComponent', () => {
  let component: OrderPreToPostCurrentInfoPageComponent;
  let fixture: ComponentFixture<OrderPreToPostCurrentInfoPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPreToPostCurrentInfoPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPreToPostCurrentInfoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
