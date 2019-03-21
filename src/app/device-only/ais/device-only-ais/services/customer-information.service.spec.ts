import { TestBed, inject } from '@angular/core/testing';

import { CustomerInformationService } from './customer-information.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('CustomerInformationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CustomerInformationService,
        HttpClient,
        HttpHandler
      ]
    });
  });

  it('should be created', inject([CustomerInformationService], (service: CustomerInformationService) => {
    expect(service).toBeTruthy();
  }));
});
