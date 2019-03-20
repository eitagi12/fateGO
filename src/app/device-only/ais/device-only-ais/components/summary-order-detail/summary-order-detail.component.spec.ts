import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryOrderDetailComponent } from './summary-order-detail.component';

describe('SummaryOrderDetailComponent', () => {
  let component: SummaryOrderDetailComponent;
  let fixture: ComponentFixture<SummaryOrderDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryOrderDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryOrderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
