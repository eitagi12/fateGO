import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ShoppingCartDetailComponent } from './shopping-cart-detail.component';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Pipe, PipeTransform, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

@Pipe({ name: 'mobileNo' })
class MockMobileNoPipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('ShoppingCartDetailComponent', () => {
  let component: ShoppingCartDetailComponent;
  let fixture: ComponentFixture<ShoppingCartDetailComponent>;

  setupTestBed({
    declarations: [
      ShoppingCartDetailComponent,
      MockMobileNoPipe
    ],
    providers: [
      {
        provide: TransactionService,
        useValue: {
          load: jest.fn()
        }
      },
      {
        provide: PriceOptionService,
        useValue: {
          load: jest.fn(() => {
            return {
              trade: {
                priceType: 'NORMAL',
                normalPrice: '22590',
                promotionPrice: '18500'
              }
            };
          })
        }
      }
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingCartDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
