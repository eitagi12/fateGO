import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmTradeInPageComponent } from './confirm-trade-in-page.component';

describe('ConfirmTradeInPageComponent', () => {
  let component: ConfirmTradeInPageComponent;
  let fixture: ComponentFixture<ConfirmTradeInPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmTradeInPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmTradeInPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
