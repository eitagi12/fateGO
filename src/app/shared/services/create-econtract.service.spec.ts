import { TestBed, inject } from '@angular/core/testing';

import { CreateEcontractService } from './create-econtract.service';

describe('CreateEcontractService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreateEcontractService]
    });
  });

  it('should be created', inject([CreateEcontractService], (service: CreateEcontractService) => {
    expect(service).toBeTruthy();
  }));
});
