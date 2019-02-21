import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNewRegisterVerifyDocumentPageComponent } from './order-new-register-verify-document-page.component';

describe('OrderNewRegisterVerifyDocumentPageComponent', () => {
  let component: OrderNewRegisterVerifyDocumentPageComponent;
  let fixture: ComponentFixture<OrderNewRegisterVerifyDocumentPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderNewRegisterVerifyDocumentPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderNewRegisterVerifyDocumentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
