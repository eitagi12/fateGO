import { TestBed, inject } from '@angular/core/testing';

import { FaceRecognitionService } from './face-recognition.service';

describe('FaceRecognitionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FaceRecognitionService]
    });
  });

  it('should be created', inject([FaceRecognitionService], (service: FaceRecognitionService) => {
    expect(service).toBeTruthy();
  }));
});
