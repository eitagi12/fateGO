import { TestBed, inject } from '@angular/core/testing';
import { MobileCareService } from './mobile-care.service';
import { HttpClient } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';

describe('MobileCareService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MobileCareService,
        HttpClient,
        HttpHandler
      ]
    });
  });

  it('should be created', inject([MobileCareService], (service: MobileCareService) => {
    expect(service).toBeTruthy();
  }));
});
