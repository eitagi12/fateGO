import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryProductAndServiceComponent } from './summary-product-and-service.component';
import { BsModalService } from 'ngx-bootstrap';
import { TransactionService } from 'src/app/shared/services/transaction.service';

describe('SummaryProductAndServiceComponent', () => {
  let component: SummaryProductAndServiceComponent;
  let fixture: ComponentFixture<SummaryProductAndServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryProductAndServiceComponent ],
      providers: [
        {
          provide: BsModalService,
          useValue: {}
        },
        {
          provide: TransactionService,
          useValue: {
            load: jest.fn()
          }
        }
      ]
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
