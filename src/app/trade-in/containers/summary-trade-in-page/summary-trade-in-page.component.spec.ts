import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryTradeInPageComponent } from './summary-trade-in-page.component';

describe('SummaryTradeInPageComponent', () => {
  let component: SummaryTradeInPageComponent;
  let fixture: ComponentFixture<SummaryTradeInPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryTradeInPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryTradeInPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
