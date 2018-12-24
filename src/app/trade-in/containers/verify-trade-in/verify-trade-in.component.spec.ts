import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyTradeInComponent } from './verify-trade-in.component';

describe('VerifyTradeInComponent', () => {
  let component: VerifyTradeInComponent;
  let fixture: ComponentFixture<VerifyTradeInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyTradeInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyTradeInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
