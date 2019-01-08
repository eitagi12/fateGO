import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CriteriaTradeInComponent } from './criteria-trade-in.component';

describe('CriteriaTradeInComponent', () => {
  let component: CriteriaTradeInComponent;
  let fixture: ComponentFixture<CriteriaTradeInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CriteriaTradeInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CriteriaTradeInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
