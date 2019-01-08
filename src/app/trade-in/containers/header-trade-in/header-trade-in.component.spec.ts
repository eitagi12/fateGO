import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderTradeInComponent } from './header-trade-in.component';

describe('HeaderTradeInComponent', () => {
  let component: HeaderTradeInComponent;
  let fixture: ComponentFixture<HeaderTradeInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderTradeInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderTradeInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
