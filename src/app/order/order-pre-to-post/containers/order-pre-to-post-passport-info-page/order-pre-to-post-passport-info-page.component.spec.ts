import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPreToPostPassportInfoPageComponent } from './order-pre-to-post-passport-info-page.component';

describe('OrderPreToPostPassportInfoPageComponent', () => {
  let component: OrderPreToPostPassportInfoPageComponent;
  let fixture: ComponentFixture<OrderPreToPostPassportInfoPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPreToPostPassportInfoPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPreToPostPassportInfoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
