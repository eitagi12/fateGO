import { TestBed, inject } from '@angular/core/testing';

import { AddToCartService } from './add-to-cart.service';
import { HttpClientModule } from '@angular/common/http';

describe('AddToCartService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule ],
      providers: [AddToCartService]
    });
  });

  it('should be created', inject([AddToCartService], (service: AddToCartService) => {
    expect(service).toBeTruthy();
  }));
});
