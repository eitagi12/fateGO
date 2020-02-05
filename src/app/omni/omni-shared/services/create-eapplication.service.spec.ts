import { TestBed, inject } from '@angular/core/testing';

import { CreateEapplicationService } from './create-eapplication.service';

describe('CreateEapplicationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreateEapplicationService]
    });
  });

  it('should be created', inject([CreateEapplicationService], (service: CreateEapplicationService) => {
    expect(service).toBeTruthy();
  }));
});
