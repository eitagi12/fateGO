import { TestBed, inject } from '@angular/core/testing';

import { ValidateCustomerService } from './validate-customer.service';

describe('ValidateCustomerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValidateCustomerService]
    });
  });

  it('should be created', inject([ValidateCustomerService], (service: ValidateCustomerService) => {
    expect(service).toBeTruthy();
  }));
});
