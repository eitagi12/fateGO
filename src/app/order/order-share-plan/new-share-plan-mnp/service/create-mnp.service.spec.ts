import { TestBed, inject } from '@angular/core/testing';

import { CreateMnpService } from './create-mnp.service';

describe('CreateMnpService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreateMnpService]
    });
  });

  it('should be created', inject([CreateMnpService], (service: CreateMnpService) => {
    expect(service).toBeTruthy();
  }));
});
