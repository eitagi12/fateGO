import { TestBed, inject } from '@angular/core/testing';

import { RemoveCartService } from './remove-cart.service';

describe('RemoveCartService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RemoveCartService]
    });
  });

  it('should be created', inject([RemoveCartService], (service: RemoveCartService) => {
    expect(service).toBeTruthy();
  }));
});
