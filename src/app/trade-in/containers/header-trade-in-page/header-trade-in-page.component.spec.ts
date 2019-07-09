import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderTradeInPageComponent } from './header-trade-in-page.component';

describe('HeaderTradeInPageComponent', () => {
  let component: HeaderTradeInPageComponent;
  let fixture: ComponentFixture<HeaderTradeInPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderTradeInPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderTradeInPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
