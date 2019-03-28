import { TestBed, inject } from '@angular/core/testing';

import { SellerService } from './seller.service';
import { HttpClient } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';

describe('SellerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SellerService,
        HttpClient,
        HttpHandler,
      ]
    });
  });

  it('should be created', inject([SellerService], (service: SellerService) => {
    expect(service).toBeTruthy();
  }));
});
