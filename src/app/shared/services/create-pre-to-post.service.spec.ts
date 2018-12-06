import { TestBed, inject } from '@angular/core/testing';

import { CreatePreToPostService } from './create-pre-to-post.service';

describe('CreatePreToPostService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreatePreToPostService]
    });
  });

  it('should be created', inject([CreatePreToPostService], (service: CreatePreToPostService) => {
    expect(service).toBeTruthy();
  }));
});
