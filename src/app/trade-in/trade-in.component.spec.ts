import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeInComponent } from './trade-in.component';

describe('TradeInComponent', () => {
  let component: TradeInComponent;
  let fixture: ComponentFixture<TradeInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradeInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
