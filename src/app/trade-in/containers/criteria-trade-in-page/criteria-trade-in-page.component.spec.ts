import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CriteriaTradeInPageComponent } from './criteria-trade-in-page.component';

describe('CriteriaTradeInPageComponent', () => {
  let component: CriteriaTradeInPageComponent;
  let fixture: ComponentFixture<CriteriaTradeInPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CriteriaTradeInPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CriteriaTradeInPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
