import { TestBed, inject } from '@angular/core/testing';

import { CreateNewRegisterService } from './create-new-register.service';

describe('CreateNewRegisterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreateNewRegisterService]
    });
  });

  it('should be created', inject([CreateNewRegisterService], (service: CreateNewRegisterService) => {
    expect(service).toBeTruthy();
  }));
});
