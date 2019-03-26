import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SummaryProductAndServiceComponent } from './summary-product-and-service.component';
import { BsModalService } from 'ngx-bootstrap';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Pipe } from '@angular/core';
import { PipeTransform } from '@angular/core';

describe('SummaryProductAndServiceComponent', () => {
  let component: SummaryProductAndServiceComponent;
  let fixture: ComponentFixture<SummaryProductAndServiceComponent>;

  @Pipe({name: 'mobileNo'})
  class MockMobileNoPipe implements PipeTransform {
    transform(value: string): string {
        return value;
    }
  }

  setupTestBed({
    declarations: [
      SummaryProductAndServiceComponent,
      MockMobileNoPipe
    ],
    providers: [
      {
        provide: BsModalService,
        useValue: {
          show: jest.fn()
        }
      },
      {
        provide: TransactionService,
        useValue: {
          load: jest.fn()
        }
      }
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryProductAndServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
