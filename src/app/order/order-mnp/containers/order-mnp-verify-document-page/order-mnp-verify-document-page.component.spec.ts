import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMnpVerifyDocumentPageComponent } from './order-mnp-verify-document-page.component';

describe('OrderMnpVerifyDocumentPageComponent', () => {
  let component: OrderMnpVerifyDocumentPageComponent;
  let fixture: ComponentFixture<OrderMnpVerifyDocumentPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderMnpVerifyDocumentPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderMnpVerifyDocumentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
