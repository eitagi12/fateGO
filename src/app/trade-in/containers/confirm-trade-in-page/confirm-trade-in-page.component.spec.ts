import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmTradeInComponent } from './confirm-trade-in.component';

describe('ConfirmTradeInComponent', () => {
  let component: ConfirmTradeInComponent;
  let fixture: ComponentFixture<ConfirmTradeInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmTradeInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmTradeInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
