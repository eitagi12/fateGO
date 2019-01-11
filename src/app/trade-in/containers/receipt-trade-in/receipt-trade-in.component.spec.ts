import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptTradeInComponent } from './receipt-trade-in.component';

describe('ReceiptTradeInComponent', () => {
  let component: ReceiptTradeInComponent;
  let fixture: ComponentFixture<ReceiptTradeInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiptTradeInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptTradeInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
