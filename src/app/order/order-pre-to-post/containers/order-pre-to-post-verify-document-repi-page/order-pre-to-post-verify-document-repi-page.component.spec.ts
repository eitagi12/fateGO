import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPreToPostVerifyDocumentRepiPageComponent } from './order-pre-to-post-verify-document-repi-page.component';

describe('OrderPreToPostVerifyDocumentRepiPageComponent', () => {
  let component: OrderPreToPostVerifyDocumentRepiPageComponent;
  let fixture: ComponentFixture<OrderPreToPostVerifyDocumentRepiPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPreToPostVerifyDocumentRepiPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPreToPostVerifyDocumentRepiPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
