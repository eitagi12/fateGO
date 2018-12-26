import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryTradeInComponent } from './summary-trade-in.component';

describe('SummaryTradeInComponent', () => {
  let component: SummaryTradeInComponent;
  let fixture: ComponentFixture<SummaryTradeInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryTradeInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryTradeInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
