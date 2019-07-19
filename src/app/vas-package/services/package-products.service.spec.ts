import { TestBed, inject } from '@angular/core/testing';

import { PackageProductsService } from './package-products.service';

describe('PackageProductsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PackageProductsService]
    });
  });

  it('should be created', inject([PackageProductsService], (service: PackageProductsService) => {
    expect(service).toBeTruthy();
  }));
});
