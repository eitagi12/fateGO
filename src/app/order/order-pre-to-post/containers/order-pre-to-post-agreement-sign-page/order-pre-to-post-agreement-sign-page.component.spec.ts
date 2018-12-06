import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPreToPostAgreementSignPageComponent } from './order-pre-to-post-agreement-sign-page.component';

describe('OrderPreToPostAgreementSignPageComponent', () => {
  let component: OrderPreToPostAgreementSignPageComponent;
  let fixture: ComponentFixture<OrderPreToPostAgreementSignPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPreToPostAgreementSignPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPreToPostAgreementSignPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
