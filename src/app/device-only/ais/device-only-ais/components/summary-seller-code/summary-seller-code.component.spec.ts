import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummarySellerCodeComponent } from './summary-seller-code.component';
import { FormsModule } from '@angular/forms';
import { TransactionService } from 'src/app/shared/services/transaction.service';

describe('SummarySellerCodeComponent', () => {
  let component: SummarySellerCodeComponent;
  let fixture: ComponentFixture<SummarySellerCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SummarySellerCodeComponent],
      providers: [
        {
          provide: TransactionService,
          useValue: {
            load: jest.fn(() => {
              return {
                data: {
                  seller: {
                    locationCode: '1100'
                  }
                }
              };
            })
          }
        }
      ],
      imports: [FormsModule]
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
