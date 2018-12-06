import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPreToPostConfirmUserInformationPageComponent } from './order-pre-to-post-confirm-user-information-page.component';

describe('OrderPreToPostConfirmUserInformationPageComponent', () => {
  let component: OrderPreToPostConfirmUserInformationPageComponent;
  let fixture: ComponentFixture<OrderPreToPostConfirmUserInformationPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPreToPostConfirmUserInformationPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPreToPostConfirmUserInformationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
