import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingCartDetailComponent } from './shopping-cart-detail.component';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Pipe, PipeTransform } from '../../../../../../../node_modules/@angular/core';
import { CookiesStorageService } from '../../../../../../../node_modules/ngx-store';
import { TokenService } from '../../../../../../../node_modules/mychannel-shared-libs';

@Pipe({name: 'mobileNo'})
class MockMobileNoPipe implements PipeTransform {
  transform(value: string): string {
      return value;
  }
}

describe('ShoppingCartDetailComponent', () => {
  let component: ShoppingCartDetailComponent;
  let fixture: ComponentFixture<ShoppingCartDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ShoppingCartDetailComponent,
        MockMobileNoPipe
      ],
      providers: [
        CookiesStorageService,
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
            }),
          }
        },
        {
          provide: TokenService,
          useValue: {
            getUser: jest.fn()
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingCartDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
