import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPreToPostVerifyDocumentPageComponent } from './order-pre-to-post-verify-document-page.component';

describe('OrderPreToPostVerifyDocumentPageComponent', () => {
  let component: OrderPreToPostVerifyDocumentPageComponent;
  let fixture: ComponentFixture<OrderPreToPostVerifyDocumentPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPreToPostVerifyDocumentPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPreToPostVerifyDocumentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
