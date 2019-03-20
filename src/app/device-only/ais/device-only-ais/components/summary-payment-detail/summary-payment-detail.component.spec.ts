import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryPaymentDetailComponent } from './summary-payment-detail.component';

describe('SummaryPaymentDetailComponent', () => {
  let component: SummaryPaymentDetailComponent;
  let fixture: ComponentFixture<SummaryPaymentDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryPaymentDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryPaymentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
