import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyTradeInPageComponent } from './verify-trade-in-page.component';

describe('VerifyTradeInPageComponent', () => {
  let component: VerifyTradeInPageComponent;
  let fixture: ComponentFixture<VerifyTradeInPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyTradeInPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyTradeInPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
