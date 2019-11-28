import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummarySellerCodeComponent } from './summary-seller-code.component';

describe('SummarySellerCodeComponent', () => {
  let component: SummarySellerCodeComponent;
  let fixture: ComponentFixture<SummarySellerCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummarySellerCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummarySellerCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
