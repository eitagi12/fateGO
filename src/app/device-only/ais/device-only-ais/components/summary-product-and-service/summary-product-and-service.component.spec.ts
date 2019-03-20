import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryProductAndServiceComponent } from './summary-product-and-service.component';

describe('SummaryProductAndServiceComponent', () => {
  let component: SummaryProductAndServiceComponent;
  let fixture: ComponentFixture<SummaryProductAndServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryProductAndServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryProductAndServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
